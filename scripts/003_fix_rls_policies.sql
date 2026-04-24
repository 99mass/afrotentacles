-- ============================================================
-- FIX: Récursion infinie dans les policies RLS de la table admins
-- ============================================================
-- Le problème: la policy SELECT sur "admins" se consultait elle-même
-- causant une récursion infinie (code Supabase: 42P17)
--
-- INSTRUCTIONS: Exécuter ce script dans Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Supprimer les policies existantes qui causent la récursion
DROP POLICY IF EXISTS "Admins can read admins table" ON admins;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can do everything on articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage article media" ON article_media;
DROP POLICY IF EXISTS "Admins can read views" ON article_views;

-- 2. Créer une fonction SECURITY DEFINER pour vérifier si un user est admin
-- Cette fonction bypasse le RLS pour éviter la récursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Recréer les policies en utilisant la fonction is_admin()

-- Admins table: SELECT avec is_admin() pour éviter la récursion
CREATE POLICY "Admins can read admins table" ON admins
  FOR SELECT USING (auth.uid() = id);

-- Categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin());

-- Articles: les admins voient tous les articles (même brouillons)
DROP POLICY IF EXISTS "Admins can do everything on articles" ON articles;
CREATE POLICY "Admins can do everything on articles" ON articles
  FOR ALL USING (is_admin());

-- Article media
CREATE POLICY "Admins can manage article media" ON article_media
  FOR ALL USING (is_admin());

-- Article views
CREATE POLICY "Admins can read views" ON article_views
  FOR SELECT USING (is_admin());

-- ============================================================
-- NOTE IMPORTANTE: La policy "Anyone can read published articles"
-- bloque les admins qui veulent voir les brouillons via SELECT.
-- On la remplace par une policy qui autorise les admins à tout voir.
-- ============================================================
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;

CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (status = 'published' OR is_admin());
