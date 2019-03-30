module.exports = function(app, map) {
  app.get("/", (req, res, next) => {
    const r = map.list();
    res.send(r);
  });
  app.get("/:z/:x/:y", (req, res, next) => {
    const { z, y, x } = req.params;
    const r = map.render(z, y, x);
    res.setHeader("content-type", "image/png");
    res.send(r);
  });
};
