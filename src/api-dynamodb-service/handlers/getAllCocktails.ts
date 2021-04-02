import db from "../../utils/dynamodb-lib";

export const getAllCocktails = async () => {
    try {
      const resp = await db.scan();
      return {
        statusCode: 200,
        body: JSON.stringify(resp)
      }
    } catch(error) {
      return {
        statusCode: error.statusCode || 500,
        body: JSON.stringify(error)
      }
    }
  };