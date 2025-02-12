afterAll(async () => {
  // Add a small delay to allow connections to close
  await new Promise(resolve => setTimeout(resolve, 500));
}); 