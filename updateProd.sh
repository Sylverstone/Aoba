#!/bin/sh

#Utiliser quand y'aura une branch prod
pnpm build

cd ../prod
git rm -r --cached . 
rm -rf *
#copie les fichiers
rsync -av --exclude 'node_modules/' --exclude 'src/' --exclude 'README.md' --exclude 'tsconfig.json' --exclude 'pnpm-lock.yaml' --exclude '.gitignore' --exclude 'updateProd.sh' --exclude 'package.json' --exclude '.git/' ../Bot-banque-TheCasinoRP/ ./


mv package.prod.json package.json

rm -rf ./node_modules/


git add .
git commit -m "auto sync main"
git push --force


#git op