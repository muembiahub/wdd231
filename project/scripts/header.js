(function injectHeader() {
  const targetId = 'header';
  const filename = 'header.html';
  const maxDepth = 5; // nombre maximum de niveaux à tester
  let attempt = 0;

  function tryPath(depth) {
    const prefix = '../'.repeat(depth);
    const path = `${prefix}${filename}`;
    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.text();
      })
      .then(html => {
        document.getElementById(targetId).innerHTML = html;
      })
      .catch(() => {
        if (depth < maxDepth) {
          tryPath(depth + 1); // essaie un niveau plus haut
        } else {
          console.error(`Échec du chargement de ${filename} après ${maxDepth} tentatives.`);
        }
      });
  }

  tryPath(0); // commence dans le dossier courant
})();