#!/bin/sh

#Utiliser quand y'aura une branch prod
pnpm build


current_dir=$(pwd)/
cd ../prod || exit
git rm -r --cached . 
rm -rf ./*
#copie les fichiers
rsync -av --exclude '.idea/' --exclude 'node_modules/' --exclude 'src/' --exclude 'README.md' --exclude 'tsconfig.json' --exclude 'pnpm-lock.yaml' --exclude '.gitignore' --exclude 'updateProd.sh' --exclude 'package.json' --exclude '.git/' "$current_dir" ./


mv package.prod.json package.json

rm -rf ./node_modules/


git add .
git commit -m "auto sync main"
git push --force


#git op