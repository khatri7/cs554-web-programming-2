import { Character } from "./Character";

const typeDefs = `#graphql
  ${Character.types}
  
  type Query {
    ${Character.queries}
  }
`;

export default typeDefs;
