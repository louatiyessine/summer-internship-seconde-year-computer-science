# 🎙️ Vidéo 1 — Ch'nahki (Texte bel Tounsi)

> Hedha eli t9oul-ou b sotek. El m9ata3 mrattbin kifkif el script. El klemet el techniques (workflow, node, trigger, JSON...) tokod-hom kima houma.

---

## 0. Intro
"Ahla w sahla, hedhi awel video fi série 3al khedma eli 3malt-ha fel stage. Fel video hedhi bch nechrah chnowa houwa **n8n**, w el vocabulaire el essentiel mte3ou, w bch nwarrikom mثال haqiqi : workflow eli yeb3ath el météo 3al email kol sbeh otomatik."

---

## 1. Ch'nowa houwa n8n ?
"n8n houwa outil ya3mel el khedmet fi bletek, otomatik, bch ma ta3melhomch b yeddik.

Ekhdhou chwaya kima **chaîne de montage**, ya3ni خط إنتاج : haja tod5ol fel bidaya, t3addi 3la barcha machines, kol machine ta3mel khedma wahda barka, w fel a5er tal3alek el produit fini.

El kelmet el mohimmin :
- **Workflow** : houwa el chaîne el kamla, ya3ni el automatisation kamla.
- **Node** : hedhi el machine, ya3ni خطوة wahda, khedma wahda. (Hedhi a3az kelma, ekhdhou balek menha.)
- **Connexions** : el خطوط eli yrabtou el nodes b b3adhhom, kima el tapis roulant.
- **Data** : el données eli tجري men node l node.

W famma **règle d'or** : el data dima tجري men **el yasar l el yamin**. Kol node yekhou el data mel node eli 9ablou, ya3mel khedmtou, w y3addi el résultat lel node eli ba3dou.

(Warri el workflow météo) Hedhi el chaîne mte3i, fiha 4 machines :
- Machine 1, el **Trigger** : kol nhar el 8, yfi9 w yبدأ el chaîne.
- Machine 2, el **HTTP Request** : yمشي yجيب el météo mel internet.
- Machine 3, el **Edit Fields** : y5alli barka el température, el ville w el description.
- Machine 4, el **Gmail** : y7ott el kol fi email w yeb3thou."

---

## 2. El 3 familles mte3 el nodes
"Ken tefhem el 3 familles hedhom, tkoun fhemt 90% mel n8n.

**1) Trigger nodes** — el so2al mte3hom : 'WA9TECH tabda ?'
- Schedule Trigger : yابدأ fi waqt m3ayen (el 8 mte3i).
- Webhook : yابدأ ki yousslou message men application o5ra.
- Manual Trigger : yابدأ ki ana na9leb 3al 'Test', yنفعني wa9t el bina.

**2) Action nodes** — 'A3MEL haja'
- HTTP Request : y3ayyet 3la ay API 3al internet (bch yجيب el météo).
- Gmail / Send Email : yeb3ath email.
- Google Sheets : yكتب données fi tableur.

**3) Logic / Data nodes** — 'A9RAR wella BADDEL'
- Edit Fields (Set) : y5alli / yبدل asم el données eli n7ebbou barka, hedhi khطوة 'extraire'.
- IF : ya3mel choix : ken famma matar → a3mel X, kanech → a3mel Y.
- Filter, Merge, Loop : avancés akther.

(Warri kol node fel workflow w 9oul famille mte3ou)
- Schedule Trigger → **Trigger**.
- HTTP Request → **Action**.
- Edit Fields → **Logic/Data**.
- Gmail → **Action**."

---

## 3. Kifech tبان el data : el JSON
"Ki el HTTP Request y3ayyet 3al API, el réponse tجي fi format esmou **JSON**. El APIs el kol yehadrou b JSON, lezem ta3rfou.

El JSON houwa paires 'clé : valeur', kima formulaire :
`{ \"city\": \"Tunis\", \"temperature\": 28, \"description\": \"clear sky\" }`
- El **clé** : esm el ma3louma (3al yasar). El **valeur** : el ma3louma el haqiqiya (3al yamin).
- El accolades `{ }` ma3nethom 'hedha objet'.
- El texte ytحط bين guillemets, el a3dad la.

Ki el données tkoun داخل ba3adhha, nesta3mlou el noqta (.) :
`{ \"name\": \"Tunis\", \"main\": { \"temp\": 28 }, \"weather\": [ { \"description\": \"clear sky\" } ] }`
- `main.temp` : od5ol fi main, w 5ou temp → 28.
- `weather[0].description` : od5ol fi weather, 5ou el 3onsor el awel `[0]`, w ba3d description.
- **Règle sehla** : ki tchouf crochets `[ ]` → hedhi liste → lezem `[0]`. Ki tchouf accolades `{ }` barka → objet → noqta (.) barka. El listes tabda men 0 mch men 1.

(Execute el HTTP Request w warri el JSON el haqiqi, w charr b sba3ek 3la main.temp w weather[0].description)"

---

## 4. El expressions `{{ }}`
"Bch ndakhlou données eli tتبدل kol nhar fi champ, nesta3mlou **expression** b double accolades.

```
Weather in {{ $json.name }} today:
Temperature: {{ $json.main.temp }}C
Condition: {{ $json.weather[0].description }}
```
- `{{ }}` ma3nethom : 'ya n8n, hedha mch texte 3adi, om5ou ma3louma haqiqiya lehna'.
- `$json` ma3neha : 'el data eli jeyya mel node eli 9bal'.
- `$json.main.temp` : nefs règle el noqta mte3 el JSON.

W famma **zoge modes** l ay champ : **Fixed** (texte thabet ma yتبدلch) wella **Expression** (b `{{ }}` l données eli tتبدل kol exécution).

(Ouvri el Gmail wella Edit Fields w warri el `{{ $json... }}` fel champs)"

---

## 5. Credentials & clés API (sécurité)
"Zoge services fel projet ma3neth yحبou preuve d'identité 9bal ma yخallouk tod5ol : el API météo, w el compte email.

**1) El clé API** : houwa el mot de passe personnel mte3ek l service.
- Lezem tsajjel (compte gratuit) bch tجيب clé API : chaîne طويلة secrète.
- Kima carte de membre : kol appel, el node ywarri el clé w el API tجاوب.
- Lehna nesta3mlou **OpenWeatherMap**, gratuit.
- ⚠️ El clé API **secrète** ! Ma tpartagihech, w ma تحطهاش fi capture d'écran.

**2) El Credentials** : houma el coffre-fort mte3 n8n.
- Tدakhkhel el clé / el login مرة wahda barka fi Credential. n8n yخazznou b sécurité (chiffré).
- Ba3d, kol node y5tar el credential mel liste, sans ma t3awed تكتب el secret.

El zoge erreurs eli lezem ta3rafhom :
- **401 Unauthorized** : 'chkoun enti ?' → el clé API na9sa wella ghalta.
- **404 Not Found** : 'el adresse hedhi ma famech' → URL ghalta.

(Warri wین el Credentials fi n8n, ama **ma twarrich el clé haqiqiya**)"

---

## 6. Démo complète mte3 el workflow
"Tawa bch n5alli el chaîne el kamla تخدem bch nwarri el résultat.
1. (Warri el Schedule Trigger m3ayyar 3al 8h)
2. A9leb 3la 'Test workflow' wella execute node b node.
3. Warri el data تعدي men node l node (el akhdhar ma3neh saye3).
4. Ouvri el Gmail w warri el email eli wsel bel météo haqiqiya mte3 Sfax.

W 3awed 9oul el chemin el kamel b sotek :
Schedule Trigger (8h) → HTTP Request (OpenWeatherMap) → Edit Fields (extraire) → Gmail (yeb3ath)."

---

## 7. Récap fel a5er
"N7ossel el kol fi jomla 3la kol leçon :
1. **n8n** kima chaîne de montage : workflow = el chaîne, node = machine, el data تجري mel yasar lel yamin.
2. **3 familles** : Trigger (wa9tech tabda), Action (a3mel / API), Logic-Data (a9rar / naddaf).
3. **JSON** = paires clé:valeur ; noqta (.) bch tod5ol, `[0]` lel listes.
4. **Expressions** `{{ $json.main.temp }}` bch tsta3mel el data.
5. **Clé API** = ticket secret ; **Credentials** = coffre-fort ; ken ma famech clé → erreur 401.

W fel video el jeya, bch nabni **agent IA** fi local b n8n w Ollama. Ye3tikom el sahha, w nchoufkom fel video el jeya."
