#!/usr/bin/env python3
"""Generates demo product data, SVG bottle images, hero PNGs and the SQL seed.
Already run for you. You do NOT need to run this to use the website.
(Optional: python3 scripts/generate_assets.py  -- needs Pillow for the hero PNGs.)"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# name, brand, inspired_by, gender, notes, description, price-per-ml, formats, (glass, cap), shape
# formats: s=2ml sample, d=5/10ml decant, p=25ml partial, r=100ml retail pack
P = [
("Aventus","Creed","","Men",["Pineapple","Birch","Musk"],"Smoky pineapple over birch and musk. The benchmark modern niche fragrance.",75,"sdpr",("#6b7a86","#c9ccd1"),"tall"),
("Baccarat Rouge 540","Maison Francis Kurkdjian","","Unisex",["Saffron","Jasmine","Amberwood"],"Airy, sweet and mineral. Saffron and jasmine over a glowing amberwood base.",95,"sdpr",("#d9a6a0","#b8893b"),"flask"),
("Layton","Parfums de Marly","","Men",["Apple","Lavender","Vanilla"],"Fresh apple and lavender settling into a creamy vanilla and woods base.",55,"sdpr",("#9c3a3a","#d9d3c4"),"round"),
("Naxos","Xerjoff","","Unisex",["Lavender","Honey","Tobacco"],"Honeyed tobacco with lavender and cinnamon, warm and gourmand.",70,"sdp",("#c58a3a","#e8d9a8"),"round"),
("Oud for Greatness","Initio","","Unisex",["Saffron","Oud","Musk"],"Bold saffron and agarwood over a smooth musk. A statement fragrance.",85,"sdp",("#222222","#b8893b"),"tall"),
("Interlude Man","Amouage","","Men",["Oregano","Amber","Incense"],"Smoky, spicy and resinous. A complex amber and incense composition.",65,"sdpr",("#3b2a1c","#c9a24a"),"flask"),
("Oud Wood","Tom Ford","","Unisex",["Oud","Sandalwood","Vanilla"],"Rare oud and sandalwood softened by vanilla and amber.",60,"sdpr",("#5a3a22","#2a2a2a"),"round"),
("Gypsy Water","Byredo","","Unisex",["Bergamot","Pine","Sandalwood"],"Woody and fresh with pine needles, incense and a vanilla finish.",55,"sdp",("#cfd8c9","#1d1d1d"),"flask"),
("Santal 33","Le Labo","","Unisex",["Cardamom","Iris","Sandalwood"],"Smoky sandalwood, leather and cedar. Dry, woody and distinctive.",58,"sdp",("#d8cdb8","#8a8a8a"),"flask"),
("Hacivat","Nishane","","Men",["Pineapple","Oakmoss","Cedar"],"Fruity pineapple and bergamot with woods and a mossy dry down.",45,"sdpr",("#4e6b4a","#d9d3c4"),"tall"),
("Replica Jazz Club","Maison Margiela","","Men",["Rum","Tobacco","Vanilla"],"Rum, tobacco leaf and vanilla. A cosy evening in a smoky jazz bar.",30,"sdpr",("#8b5a2b","#1d1d1d"),"flask"),
("Side Effect","Initio","","Unisex",["Rum","Tobacco","Vanilla"],"Boozy rum and tobacco with cinnamon and vanilla. Dark and addictive.",70,"sdp",("#3a1f1f","#b8893b"),"tall"),
("Sauvage Elixir","Dior","","Men",["Grapefruit","Lavender","Licorice"],"Concentrated spicy lavender with licorice and a warm woody base.",32,"sdpr",("#1f2a44","#c9a24a"),"round"),
("Angels' Share","Kilian","","Unisex",["Cognac","Cinnamon","Praline"],"Cognac, cinnamon and praline over oak. Warm and indulgent.",80,"sdp",("#b0662a","#2a2a2a"),"round"),
("Marbella","Mykonos","Giorgio Armani Power of You","Women",["Pear","Jasmine","Vanilla"],"A glowing, feminine blend of pear and jasmine over soft vanilla.",34,"sd",("#c98a6b","#d7a58c"),"flask"),
("Inception","Mykonos","","Men",["Lemon","Black Tea","Musk"],"Bright lemon and black tea resting on a clean musk base.",35,"sd",("#1d3fa8","#c9a24a"),"tall"),
("Reflection","Mykonos","","Unisex",["Grapefruit","Peach","Musk"],"Juicy grapefruit and peach with a soft musk. Fresh and easy to wear.",30,"sd",("#c8ccd2","#6b3f2a"),"flask"),
("Hawas Ice","Rasasi","","Men",["Apple","Plum","Musk"],"Icy aquatic freshness with apple and plum over musk.",28,"sd",("#6c8fe6","#e8e8e8"),"round"),
("Supremacy Collector's Edition","Afnan","","Men",["Pineapple","Orange Blossom","Oakmoss"],"Fruity, fresh opening with a mossy woody dry down.",33,"sd",("#b9b9b9","#1d1d1d"),"round"),
("Club de Nuit Intense Man","Armaf","","Men",["Lemon","Birch","Musk"],"Citrus and smoky birch with a long musky finish.",25,"sd",("#2d2d2d","#c0c0c0"),"tall"),
("Khamrah","Lattafa","","Unisex",["Cinnamon","Date","Vanilla"],"Warm cinnamon, date and praline over vanilla and tonka.",22,"sd",("#a3682e","#e0c27a"),"round"),
("Asad","Lattafa","","Men",["Pepper","Tobacco","Vanilla"],"Spicy pepper, tobacco and vanilla. Dark, warm and long lasting.",20,"sd",("#3a2f46","#c9a24a"),"tall"),
]


def r5(x):
    return int(round(x / 5.0) * 5)


products, variants = [], []
for i, (name, brand, insp, gender, notes, desc, ppm, fmt, cols, shape) in enumerate(P):
    slug = re.sub(r"[^a-z0-9]+", "-", (brand + " " + name).lower()).strip("-")
    pid = f"p{i+1:02d}"
    products.append(dict(id=pid, slug=slug, name=name, brand=brand, inspired_by=insp, gender=gender,
                         description=desc, notes=notes, image_url=f"/images/products/{slug}.svg",
                         is_featured=i < 8, is_active=True, sort_order=i))

    def v(t, ml, price, stock):
        variants.append(dict(id=f"{pid}-{t}-{ml}", product_id=pid, type=t, size_ml=ml, price=price,
                             stock=stock, is_active=True))

    if "s" in fmt: v("sample", 2, r5(ppm * 2 * 1.45 + 20), 25)
    if "d" in fmt:
        v("decant", 5, r5(ppm * 5 * 1.15 + 20), 0 if i == 3 else 30)
        v("decant", 10, r5(ppm * 10 * 1.0 + 20), 18)
    if "p" in fmt: v("partial", 25, r5(ppm * 25 * 0.82), 0 if i % 4 == 0 else 3)
    if "r" in fmt: v("retail", 100, r5(ppm * 100 * 0.62), 0 if i % 3 == 0 else 2)


def bottle(glass, cap, shape, label):
    if shape == "tall":
        body = f'<rect x="215" y="230" width="170" height="290" rx="14" fill="{glass}"/><rect x="215" y="230" width="170" height="290" rx="14" fill="url(#sh)"/>'
        neck = f'<rect x="270" y="195" width="60" height="38" fill="#222"/><rect x="250" y="95" width="100" height="105" rx="10" fill="{cap}"/>'
        lab = (300, 400)
    elif shape == "flask":
        d = "M205 300 Q205 235 260 235 L340 235 Q395 235 395 300 L395 505 Q395 525 375 525 L225 525 Q205 525 205 505 Z"
        body = f'<path d="{d}" fill="{glass}"/><path d="{d}" fill="url(#sh)"/>'
        neck = f'<rect x="272" y="205" width="56" height="34" fill="#222"/><rect x="240" y="130" width="120" height="80" rx="8" fill="{cap}"/>'
        lab = (300, 410)
    else:
        body = f'<ellipse cx="300" cy="400" rx="125" ry="125" fill="{glass}"/><ellipse cx="300" cy="400" rx="125" ry="125" fill="url(#sh)"/>'
        neck = f'<rect x="275" y="250" width="50" height="34" fill="#222"/><rect x="245" y="160" width="110" height="95" rx="48" fill="{cap}"/>'
        lab = (300, 405)
    short = label if len(label) <= 16 else label[:15] + "…"
    short = short.replace("&", "and")
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="{short}">
<defs><linearGradient id="sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
<ellipse cx="300" cy="545" rx="130" ry="14" fill="#000" opacity=".28"/>{body}{neck}
<rect x="{lab[0]-62}" y="{lab[1]-38}" width="124" height="76" rx="4" fill="#f6f3ed" opacity=".92"/>
<text x="{lab[0]}" y="{lab[1]-8}" font-family="Georgia,serif" font-style="italic" font-size="15" text-anchor="middle" fill="#222">{short}</text>
<line x1="{lab[0]-30}" x2="{lab[0]+30}" y1="{lab[1]+5}" y2="{lab[1]+5}" stroke="#b8893b"/>
<text x="{lab[0]}" y="{lab[1]+25}" font-family="Arial,sans-serif" font-size="9" letter-spacing="2" text-anchor="middle" fill="#555">NICHE PERFUME INDIA</text></svg>'''


for p, row in zip(products, P):
    open(f"{ROOT}/public/images/products/{p['slug']}.svg", "w").write(bottle(row[8][0], row[8][1], row[9], row[0]))


def vial(color, h):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200"><rect x="48" y="14" width="24" height="26" rx="3" fill="#1d1d1d"/><rect x="42" y="38" width="36" height="{h}" rx="6" fill="{color}" opacity=".95"/><rect x="48" y="{38+h-40}" width="24" height="34" rx="2" fill="#fff" opacity=".18"/></svg>'


for n, (c, h) in {"vial-sample": ("#f2f2f2", 110), "vial-5": ("#f2f2f2", 130), "vial-10": ("#1d1d1d", 140)}.items():
    open(f"{ROOT}/public/images/{n}.svg", "w").write(vial(c, h))
open(f"{ROOT}/public/images/bottle-generic.svg", "w").write(bottle("#8a7a5a", "#c9a24a", "round", "Retail Pack"))

# The four decorative hero bottles referenced by your original homepage (images/image1..4.png)
from PIL import Image, ImageDraw


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def hero_png(path, glass, cap, shape):
    S = 4
    W, H = 420 * S, 600 * S
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    g, c = hexrgb(glass) + (255,), hexrgb(cap) + (255,)
    cx = W // 2
    if shape == "tall":
        d.rounded_rectangle((cx - 85 * S, 210 * S, cx + 85 * S, 540 * S), 14 * S, fill=g)
        d.rectangle((cx - 28 * S, 180 * S, cx + 28 * S, 215 * S), fill=(30, 30, 30, 255))
        d.rounded_rectangle((cx - 50 * S, 70 * S, cx + 50 * S, 185 * S), 10 * S, fill=c)
        bounds = (cx - 85 * S, 210 * S, cx + 85 * S, 540 * S)
    elif shape == "flask":
        d.rounded_rectangle((cx - 95 * S, 240 * S, cx + 95 * S, 540 * S), 55 * S, fill=g)
        d.rectangle((cx - 28 * S, 205 * S, cx + 28 * S, 245 * S), fill=(30, 30, 30, 255))
        d.rounded_rectangle((cx - 58 * S, 120 * S, cx + 58 * S, 210 * S), 8 * S, fill=c)
        bounds = (cx - 95 * S, 240 * S, cx + 95 * S, 540 * S)
    else:
        d.ellipse((cx - 130 * S, 290 * S, cx + 130 * S, 550 * S), fill=g)
        d.rectangle((cx - 25 * S, 255 * S, cx + 25 * S, 300 * S), fill=(30, 30, 30, 255))
        d.rounded_rectangle((cx - 55 * S, 150 * S, cx + 55 * S, 262 * S), 45 * S, fill=c)
        bounds = (cx - 130 * S, 290 * S, cx + 130 * S, 550 * S)
    # glass shading: highlight left, shadow right (clipped to the bottle)
    mask = im.split()[3]
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = sh.load()
    x0, x1 = bounds[0], bounds[2]
    for x in range(x0, x1):
        t = (x - x0) / (x1 - x0)
        a = int(max(0, 0.30 * (1 - t / 0.35)) * 255) if t < 0.35 else int(max(0, (t - 0.35) / 0.65) * 0.38 * 255)
        col = (255, 255, 255, a) if t < 0.35 else (0, 0, 0, a)
        for y in range(bounds[1], bounds[3]):
            px[x, y] = col
    sh.putalpha(Image.composite(sh.split()[3], Image.new("L", (W, H), 0), mask))
    im = Image.alpha_composite(im, sh)
    d = ImageDraw.Draw(im)
    lx, ly = cx, (bounds[1] + bounds[3]) // 2
    d.rounded_rectangle((lx - 58 * S, ly - 36 * S, lx + 58 * S, ly + 36 * S), 4 * S, fill=(246, 243, 237, 235))
    d.line((lx - 28 * S, ly, lx + 28 * S, ly), fill=(184, 137, 59, 255), width=2 * S)
    im = im.resize((W // S, H // S), Image.LANCZOS)
    im.crop(im.getbbox()).save(path)


hero = [("#9c3a3a", "#d9d3c4", "round"), ("#d9a6a0", "#b8893b", "flask"),
        ("#6b7a86", "#c9ccd1", "tall"), ("#1d3fa8", "#c9a24a", "tall")]
for k, (g_, c_, s_) in enumerate(hero, 1):
    hero_png(f"{ROOT}/public/images/image{k}.png", g_, c_, s_)

for k in (1, 2, 3):
    open(f"{ROOT}/public/images/reel{k}.svg", "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"><rect width="360" height="640" fill="#1e1e26"/><circle cx="180" cy="300" r="46" fill="none" stroke="#e6bd55" stroke-width="3"/><path d="M168 280 L204 300 L168 320 Z" fill="#e6bd55"/><text x="180" y="400" fill="#a6a19a" font-family="Arial" font-size="16" text-anchor="middle">Reel {k}</text></svg>')

json.dump(dict(products=products, variants=variants), open(f"{ROOT}/src/data/seed.json", "w"), indent=1, ensure_ascii=False)


def q(s):
    return "'" + str(s).replace("'", "''") + "'"


sql = ["-- Demo products and variants (generated). Safe to re-run: ON CONFLICT DO NOTHING.", "begin;"]
for p in products:
    notes = "array[" + ",".join(q(n) for n in p["notes"]) + "]"
    sql.append(f"insert into public.products (slug,name,brand,inspired_by,gender,description,notes,image_url,is_featured,is_active,sort_order) values ({q(p['slug'])},{q(p['name'])},{q(p['brand'])},{q(p['inspired_by'])},{q(p['gender'])},{q(p['description'])},{notes},{q(p['image_url'])},{str(p['is_featured']).lower()},true,{p['sort_order']}) on conflict (slug) do nothing;")
pm = {p["id"]: p["slug"] for p in products}
for v in variants:
    sql.append(f"insert into public.product_variants (product_id,type,size_ml,price,stock) select id,{q(v['type'])},{v['size_ml']},{v['price']},{v['stock']} from public.products where slug={q(pm[v['product_id']])} on conflict (product_id,type,size_ml) do nothing;")
sql.append("commit;")
open(f"{ROOT}/supabase/migrations/002_seed_demo_products.sql", "w").write("\n".join(sql) + "\n")
print(len(products), "products,", len(variants), "variants")
