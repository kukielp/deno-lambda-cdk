import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/json" },
    body: JSON.stringify(constructResponse(event)),
  };
}

class Person {
  private _fullName: string;
  get fullName(): string {
    return this._fullName + '!';
  }
  constructor(firstName: string, ) {
      this._fullName = firstName;
  }
}

class Result {
  user: Person;
  message: string;
  constructor(u: Person, m: string){
    this.message = m;
    this.user = u;
  }
}

const constructResponse = (event: APIGatewayProxyEvent) => {
  let name = event.path.replace("/","");
  let s = new Person(name);
  let r = new Result(s, `Hi ${s.fullName}, Welcome to deno ${Deno.version.deno} 🦕`);

  return r;
}