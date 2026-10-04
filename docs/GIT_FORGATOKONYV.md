# Git forgatókönyv (mindhárom csapattagnak)

Csak azt commitoljátok, amit tényleg ti csináltatok vagy értetek át. Egy nagy fájlt bontsatok logikai lépésekre (`git add -p`).

## Branching stratégia
- `main`: mindig működő, bemutatható állapot. Csak `develop`-ból, PR-rel kerül bele.
- `develop`: integrációs ág.
- `feature/<téma>`, `docs/<téma>`, `test/<téma>`: rövid életű ágak, PR-rel mennek `develop`-ba.
- Commit üzenet: `típus: rövid leírás` (feat, fix, docs, style, test, chore).
- PR-t a Lead Developer (Péter) bírálja el, legalább egy review kell.

## 1. Tóth Péter – Lead Developer
```
git init && git add README.md .gitignore
git commit -m "chore: initial repository with README"
git branch -M main && git remote add origin <REPO_URL> && git push -u origin main
git checkout -b develop && git push -u origin develop
git checkout -b feature/core-engine
git add vendor/ && git commit -m "chore: vendor three.js r160 for offline use"
git add js/main.js, js/museum.js, js/models.js -p   # részletekben:
  "feat: renderer, scene and resize handling"
  "feat: museum layout with central hall, four rooms and colliders"
  "feat: first person controls with pointer lock and collision"
  "feat: daycycle with hour based lighting"
  "feat: procedural low-poly exhibit models"
  "feat: exhibit loading per owner and hover interaction"
git push -u origin feature/core-engine   # PR → develop
git checkout -b feature/content-peter
git commit -am "feat(data): add Tóth Péter exhibits"   # PR → develop
```
Plusz: PR-ek review-ja és merge-ek (`Merge pull request ...` látszik a historyban).

## 2. Katona Gergő – UI/UX és QA
```
git checkout develop && git pull && git checkout -b feature/ui-hud
git add index.html && git commit -m "feat: HTML shell with HUD, info panel and pause menu"
git add css/style.css && git commit -m "style: retro SuperHot inspired theme and responsive HUD"
git push -u origin feature/ui-hud   # PR → develop

git checkout develop && git pull && git checkout -b feature/content-gergo
git commit -am "feat(data): add Katona Gergő exhibits from biography"   # PR → develop

git checkout develop && git pull && git checkout -b test/manual-round-1
git add docs/TESZT_JEGYZOKONYV.md
git commit -m "test: manual test log for movement, collision, daycycle, owner switching"
# talált hibák: Trello kártya + "fix: ..." commit külön ágon
```

## 3. Gál Péter – Scrum Master
```
git checkout develop && git pull && git checkout -b docs/project-management
git add docs/stakeholder-terkep.* && git commit -m "docs: add stakeholder map"
git add docs/szerepkor-matrix.* && git commit -m "docs: add role and task matrix"
git add docs/trello-osszefoglalo.* && git commit -m "docs: summarize Trello board (done, in progress, dropped ideas)"
git push -u origin docs/project-management   # PR → develop

git checkout develop && git pull && git checkout -b feature/content-gal
git commit -am "feat(data): add Gál Péter exhibits"   # PR → develop

git checkout -b docs/documentation
git add docs/DOKUMENTACIO.docx && git commit -m "docs: complete user and developer documentation"
git checkout -b chore/team-name
git commit -am "chore: set final team name"   # ha megvan a csapatnév
```
Végén: Scrum Master megnyit egy `develop` → `main` PR-t, Péter merge-eli, `git tag v1.0`.
