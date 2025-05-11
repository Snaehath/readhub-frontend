"use server";

import client from "../lib/mongodb";

export async function databaseConnection() {
  let isConnected = false;
  try {
    const mongoClient = await client.connect();
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    ); // because this is a server action, the console.log will be outputted to your terminal not in the browser
    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}
