export default async function handler(req, res) {
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + req.query.id,
    {
      headers: {
        Authorization: "Token 820bbb9b4df72d0cae6e6afc71f9c2f0ba8ae568",
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
}