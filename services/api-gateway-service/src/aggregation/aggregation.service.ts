import { Injectable } from '@nestjs/common';
import { HttpClientService } from '../http-client/http-client.service';
import * as fs from 'fs';
import * as path from 'path';

interface ServiceConfig {
  name: string;
  versions: string[];
  servers: { host: string; port: number }[];
}

@Injectable()
export class AggregationService {
  private services: ServiceConfig[];

  constructor(private httpClient: HttpClientService) {
    const configPath = path.join(__dirname, '../../config/services.json');
    this.services = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  async getMergedSpec(version: string, globalPrefix: string = ''): Promise<any> {
    const mergedSpec = {
      openapi: '3.0.0',
      info: {
        title: `Unified API ${version.toUpperCase()}`,
        version: '1.0.0',
      },
      servers: [],
      paths: {},
      components: { schemas: {}, parameters: {}, responses: {}, requestBodies: {} },
    };

    for (const service of this.services) {
      if (!service.versions.includes(version)) continue;

      let spec: any = null;
      let successfulServer: { host: string; port: number } | null = null;

      for (const server of service.servers) {
        try {
          const url = `http://${server.host}:${server.port}/api/${version}-json`;
          spec = await this.httpClient.get<any>(url);
          successfulServer = server;
          break; // Success, stop trying other servers
        } catch (error) {
          console.error(`Failed to fetch spec for ${service.name} ${version} from ${server.host}:${server.port}:`, error.message);
        }
      }

      if (!spec) {
        console.error(`All servers failed for ${service.name} ${version}`);
        continue;
      }

      // Merge paths directly (no prefixing needed as paths are unique)
      Object.assign(mergedSpec.paths, spec.paths);

      // Merge components directly
      for (const [type, components] of Object.entries(spec.components || {})) {
        if (typeof components === 'object' && components !== null) {
          Object.assign(mergedSpec.components[type], components);
        }
      }

      // Add per-path servers for all servers of the current service's paths
      const serviceServers = service.servers.map(s => ({ url: `http://${s.host}:${s.port}` }));
      for (const pathKey of Object.keys(spec.paths)) {
        if (mergedSpec.paths[pathKey]) {
          for (const method of Object.keys(mergedSpec.paths[pathKey])) {
            if (method !== 'parameters' && typeof mergedSpec.paths[pathKey][method] === 'object') {
              mergedSpec.paths[pathKey][method].servers = [{ url: globalPrefix}]
            }
          }
        }
      }
    }

    return mergedSpec;
  }

}