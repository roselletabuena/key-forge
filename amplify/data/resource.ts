import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "read", "create", "update", 
and "delete" any "Todo" records. 
=========================================================================*/
const schema = a.schema({
    Todo: a
        .model({
            content: a.string(),
        })
        .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'iam',
    },
});

/*== STEP 2 ===============================================================
Go to your frontend source code to setup the Data client
=========================================================================*/

/*
const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list();
*/

/*== STEP 3 ===============================================================
Fetch your data, create records or subscribe to updates
=========================================================================*/

/*
const { data: newTodo } = await client.models.Todo.create({
  content: "My new todo",
});
*/
