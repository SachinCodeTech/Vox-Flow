export const generateWorkflow = async (prompt: string) => {
  const response = await fetch("/api/generate-workflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate workflow via proxy");
  }

  return response.json();
};
