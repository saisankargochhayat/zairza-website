to make changes to gh pages
git add .
git status  
git commit -m 'commit message'
git push origin master
git checkout gh-pages // go to the gh-pages branch
git rebase master // bring gh-pages up to date with master
git push origin gh-pages // commit the changes
git checkout master // return to the master branch

to view logs 
_> rhc ssh nodejs
_> nodejs-shubham21.rhcloud.com 558bd091e0b8cdbac600013b]\>  tail -f -n 100 app-root/logs/nodejs.log