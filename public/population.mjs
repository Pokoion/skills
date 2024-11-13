import OpenAI from 'openai';
import fs from 'fs/promises';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTasksAndResources(skill) {
  const prompt = `
Generate a detailed learning plan for the following electronics skill:
${skill.text}
The response should be in JSON format with the following structure:
{
  "id": ${skill.id},
  "text": ${JSON.stringify(skill.text)},
  "icon": "${skill.icon}",
  "description": "Here create a description for the skill",
  "tasks": [
    "An array of 5-7 specific, actionable tasks to complete this skill",
    "Each task should be clear and measurable",
    "Include documentation requirements"
  ],
  "resources": [
    "4-5 specific learning resources with URLs",
    "Include a mix of tutorials, documentation, and video content",
    "Resources should be from reputable electronics education sites"
  ]
}
Focus on practical, hands-on tasks that build the skill progressively.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response and return it
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error(`Error generating content for skill ${skill.id}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Read the skills.json file
    const skillsData = await fs.readFile('skills.json', 'utf8');
    const skills = JSON.parse(skillsData);

    // Process each skill
    const learningPlans = [];
    for (const skill of skills) {
      console.log(`Generating learning plan for skill ${skill.id}...`);
      const plan = await generateTasksAndResources(skill);
      learningPlans.push(plan);
      
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Write the results to a new file
    await fs.writeFile(
      'learning_plans.json',
      JSON.stringify(learningPlans, null, 2),
      'utf8'
    );

    console.log('Learning plans generated successfully!');
    return learningPlans;
  } catch (error) {
    console.error('Error in main process:', error);
    throw error;
  }
}

// Run the script
main().catch(console.error);