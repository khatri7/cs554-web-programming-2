import { Location } from "./Location";

const typeDefs = `#graphql
  ${Location.types}
  
  type Query {
    ${Location.queries}
  }
  
  type Mutation {
    ${Location.mutations}
  }
`;

export default typeDefs;
