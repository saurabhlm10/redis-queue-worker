import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
  const { problemId, code, language } = JSON.parse(submission);

  console.log(`Processing submission for problemId ${problemId}...`);
  console.log(`Code: ${code}`);
  console.log(`Language: ${language}`);
  // Here you would add your actual processing logic

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Finished processing submission for problemId ${problemId}.`);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to redis");

    while (true) {
      try {
        const response = await client.brPop("submissions", 0);
        // @ts-ignore
        await processSubmission(response.element);
      } catch (error) {
        console.error("Error processing submission", error);
      }
    }
  } catch (error) {
    console.error("Failed to connect to redis", error);
  }
}

startWorker();
