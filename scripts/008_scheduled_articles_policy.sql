-- Modification de la politique RLS pour masquer les articles programmés aux visiteurs
-- Le visiteur public ne doit voir que les articles au statut 'published' ET dont la date de publication est passée.
-- Les administrateurs (via la fonction is_admin()) conservent l'accès à tous les articles.

DROP POLICY IF EXISTS "Public can read published articles" ON articles;

CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (
    (status = 'published' AND published_date <= NOW())
    OR is_admin()
  );
