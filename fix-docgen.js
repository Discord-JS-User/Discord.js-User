require("node:fs").writeFileSync(
	__dirname + "/node_modules/@discordjs/docgen/dist/index.cjs",
	`"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
const e = require("@discordjs/docgen/dist/package.cjs");
const d = require("node:fs"),
	s = require("node:path"),
	$ = require("jsdoc-to-markdown"),
	S = require("typedoc"),
	b = require("./documentation.cjs");
function q(o) {
	return o && typeof o == "object" && "default" in o ? o.default : o;
}
const T = q($);
function k({ input: o, custom: a, root: p, output: l, typescript: f }) {
	let i = [];
	if (f) {
		console.log("Parsing Typescript in source files...");
		const n = new S.Application();
		n.options.addReader(new S.TSConfigReader()), n.bootstrap({ entryPoints: o });
		const u = n.convert();
		u && ((i = n.serializer.toObject(u).children), console.log(\`\${i.length} items parsed.\`));
	} else console.log("Parsing JSDocs in source files..."), (i = T.getTemplateDataSync({ files: o })), console.log(\`\${i.length} JSDoc items parsed.\`);
	const t = {};
	if (a) {
		console.log("Loading custom docs files...");
		const n = s.dirname(a),
			u = d.readFileSync(a, "utf-8"),
			O = JSON.parse(u);
		for (const e of O) {
			const c = e.id ?? e.name.toLowerCase(),
				w = s.join(n, e.path ?? c);
			t[c] = { name: e.name || e.id, files: {} };
			for (const r of e.files) {
				const y = s.join(w, r.path),
					h = s.extname(r.path),
					D = r.id ?? s.basename(r.path, h),
					_ = d.readFileSync(y, "utf-8");
				t[c].files[D] = { name: r.name, type: h.toLowerCase().replace(/^./, ""), content: _, path: s.relative(p, y).replace(/\\\\/g, "/") };
			}
		}
		const g = Object.keys(t)
				.map(e => Object.keys(t[e]))
				.reduce((e, c) => e + c.length, 0),
			m = Object.keys(t).length;
		console.log(\`\${g} custom docs file\${g === 1 ? "" : "s"} in \${m} categor\${m === 1 ? "y" : "ies"} loaded.\`);
	}
	console.log(\`Serializing documentation with format version \${b.Documentation.FORMAT_VERSION}...\`);
	let abc = [];
	for (const i2 of i) {
		if (i2.children) {
			abc.push(
				...i2.children.map(i3 => {
					if (i3.name == "default") {
						i3.name = i2.name.split("/")[i2.name.split("/").length - 1];
					}
					return i3;
				})
			);
		} else {
			abc.push(i2);
		}
	}
	const j = new b.Documentation(abc, { input: o, custom: a, root: p, output: l, typescript: f }, t);
	l && (console.log(\`Writing to \${l}...\`), d.writeFileSync(l, JSON.stringify(j.serialize()))), console.log("Done!");
}
exports.build = k;
//# sourceMappingURL=index.cjs.map
`
);
