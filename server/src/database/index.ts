import { ArangoDBService } from "./arangoDB/arango.service";
import constants from "./constants";
import { MockDBService } from "./mockDB/mock.service";

const providers = [
  {
    provide: constants.DATABASE_PROVIDER_ARANGO,
    useClass: ArangoDBService,
  },
  {
    provide: constants.DATABASE_PROVIDER_MOCK,
    useClass: MockDBService,
  },
];

export function getDatabaseProvider(provider: string) {
  let service = providers.find((p) => p.provide === provider);
  if (!service) {
    service = providers.find(
      (p) => p.provide === constants.DATABASE_PROVIDER_MOCK,
    );
  }
  return [
    {
      ...service,
      ...{ provide: constants.DATABASE_PROVIDER_SERVICE },
    },
  ];
}
