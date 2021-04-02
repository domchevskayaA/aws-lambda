import { Event, Cocktail, requiredAttrs } from "../types";
import { uid } from "../../utils/uid";
import db from "../../utils/dynamodb-lib";
import { isEqual } from "lodash";

export const saveCocktail = async (event: Event<Cocktail>) => {
    try {
      if (!event || !event.body) {
        return {
          statusCode: 400,
          message: "Request body can't be empty.",
        }
      }
      const data = event.body ? JSON.parse(event.body) : event;
  
      if (!isEqual(Object.keys(data).sort(), requiredAttrs.sort())) {
        return {
          statusCode: 400,
          body: `Request body should contain following properties: ${requiredAttrs.join(', ')}.`
        }
      }
  
      const item = { ...data, id: uid() };
      await db.put({ Item: item })
      return {
        statusCode: 201,
        body: JSON.stringify({ Item: item })
      }
    } catch (error) {
      console.log(error, 'error');
        return {
          statusCode: error.statusCode || 500,
          body: JSON.stringify(error)
        }
    }    
};
  