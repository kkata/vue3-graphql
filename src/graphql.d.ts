declare module "*.gql" {
  import { DocumentNode } from "@apollo/client/core";
  const defaultDocument: DocumentNode;
  export default defaultDocument;
}
