export default class VarEnv {
  public static readonly secret_jwt = process.env.SECRET_JWT;
  public static readonly mongo_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}${process.env.ATLAS_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=AtlasCluster`;
  public static readonly port = process.env.PORT || 3000;
}