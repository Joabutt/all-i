const addBackgroundToPNG = require("lib/add-background-to-png");

export default async function handler(req, res) {
  // remnove null and undefined values
  req.body = Object.entries(req.body).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  );

  if (req.body.mask) {
    req.body.mask = addBackgroundToPNG(req.body.mask);
  }

  const body = JSON.stringify({
    // Pinned to a specific version of Stable Diffusion, fetched from:
    // https://replicate.com/stability-ai/stable-diffusion
    version: "be04660a5b93ef2aff61e3668dedb4cbeb14941e62a3fd5998364a32d613e35e",
    input: req.body,
  });

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: "Token 820bbb9b4df72d0cae6e6afc71f9c2f0ba8ae568",
      "Content-Type": "application/json",
    },
    body,
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
