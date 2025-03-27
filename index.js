export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Only POST requests allowed', { status: 405 });
    }

    const { message } = await request.json();
    if (!message) {
      return new Response('Missing message in request body', { status: 400 });
    }

    const apiKey = env.OPENAI_API_KEY;
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Du bist ein technischer Assistent für IT-Fehlermeldungen. Analysiere den Fehlertext, gib eine klare Beschreibung der Ursache und nenne praktische Schritte zur Behebung.' },
          { role: 'user', content: message }
        ],
        temperature: 0.2
      })
    });

    const data = await gptResponse.json();
    const reply = data.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};