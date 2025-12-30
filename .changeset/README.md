# Changesets

Ce dossier est gere par [Changesets](https://github.com/changesets/changesets).

## Ajouter un changeset

Pour documenter une modification, executez :

```bash
pnpm changeset
```

Cela va :
1. Vous demander quels packages sont affectes
2. Vous demander le type de version (major/minor/patch)
3. Vous demander une description du changement

## Types de versions

- **patch** : Corrections de bugs, changements mineurs (0.0.X)
- **minor** : Nouvelles fonctionnalites retrocompatibles (0.X.0)
- **major** : Changements breaking (X.0.0)

## Publication

La publication est automatique via GitHub Actions quand les changesets sont fusionnes dans `main`.
