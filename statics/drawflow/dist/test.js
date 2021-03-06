!
function(e, t) {
	"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Drawflow = t() : e.Drawflow = t()
}(window, (function() {
	return function(e) {
		var t = {};

		function s(n) {
			if (t[n]) return t[n].exports;
			var i = t[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(i.exports, i, i.exports, s), i.l = !0, i.exports
		}
		return s.m = e, s.c = t, s.d = function(e, t, n) {
			s.o(e, t) || Object.defineProperty(e, t, {
				enumerable: !0,
				get: n
			})
		}, s.r = function(e) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
				value: "Module"
			}), Object.defineProperty(e, "__esModule", {
				value: !0
			})
		}, s.t = function(e, t) {
			if (1 & t && (e = s(e)), 8 & t) return e;
			if (4 & t && "object" == typeof e && e && e.__esModule) return e;
			var n = Object.create(null);
			if (s.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: e
			}), 2 & t && "string" != typeof e) for (var i in e) s.d(n, i, function(t) {
				return e[t]
			}.bind(null, i));
			return n
		}, s.n = function(e) {
			var t = e && e.__esModule ?
			function() {
				return e.
			default
			} : function() {
				return e
			};
			return s.d(t, "a", t), t
		}, s.o = function(e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}, s.p = "", s(s.s = 0)
	}([function(e, t, s) {
		"use strict";
		s.r(t), s.d(t, "default", (function() {
			return n
		}));
		class n {
			constructor(e, t = null) {
				this.events = {}, this.container = e, this.precanvas = null, this.nodeId = 1, this.ele_selected = null, this.node_selected = null, this.drag = !1, this.editor_selected = !1, this.connection = !1, this.connection_ele = null, this.connection_selected = null, this.canvas_x = 0, this.canvas_y = 0, this.pos_x = 0, this.pos_y = 0, this.mouse_x = 0, this.mouse_y = 0, this.line_path = 5, this.first_click = null, this.select_elements = null, this.noderegister = {}, this.render = t, this.drawflow = {
					drawflow: {
						Home: {
							data: {}
						}
					}
				}, this.module = "Home", this.editor_mode = "edit", this.zoom = 1, this.zoom_max = 1.6, this.zoom_min = .5, this.evCache = new Array, this.prevDiff = -1
			}
			start() {
				this.container.classList.add("parent-drawflow"), this.container.tabIndex = 0, this.precanvas = document.createElement("div"), this.precanvas.classList.add("drawflow"), this.container.appendChild(this.precanvas), this.container.addEventListener("mouseup", this.dragEnd.bind(this)), this.container.addEventListener("mousemove", this.position.bind(this)), this.container.addEventListener("mousedown", this.click.bind(this)), this.container.addEventListener("touchend", this.dragEnd.bind(this)), this.container.addEventListener("touchmove", this.position.bind(this)), this.container.addEventListener("touchstart", this.click.bind(this)), this.container.addEventListener("contextmenu", this.contextmenu.bind(this)), this.container.addEventListener("keyup", this.key.bind(this)), this.container.addEventListener("wheel", this.zoom_enter.bind(this)), this.container.addEventListener("input", this.updateNodeValue.bind(this)), this.container.onpointerdown = this.pointerdown_handler.bind(this), this.container.onpointermove = this.pointermove_handler.bind(this), this.container.onpointerup = this.pointerup_handler.bind(this), this.container.onpointercancel = this.pointerup_handler.bind(this), this.container.onpointerout = this.pointerup_handler.bind(this), this.container.onpointerleave = this.pointerup_handler.bind(this), this.load()
			}
			pointerdown_handler(e) {
				this.evCache.push(e)
			}
			pointermove_handler(e) {
				for (var t = 0; t < this.evCache.length; t++) if (e.pointerId == this.evCache[t].pointerId) {
					this.evCache[t] = e;
					break
				}
				if (2 == this.evCache.length) {
					var s = Math.abs(this.evCache[0].clientX - this.evCache[1].clientX);
					this.prevDiff > 100 && (s > this.prevDiff && this.zoom_in(), s < this.prevDiff && this.zoom_out()), this.prevDiff = s
				}
			}
			pointerup_handler(e) {
				this.remove_event(e), this.evCache.length < 2 && (this.prevDiff = -1)
			}
			remove_event(e) {
				for (var t = 0; t < this.evCache.length; t++) if (this.evCache[t].pointerId == e.pointerId) {
					this.evCache.splice(t, 1);
					break
				}
			}
			load() {
				for (var e in this.drawflow.drawflow[this.module].data) {
					this.addNodeImport(this.drawflow.drawflow[this.module].data[e], this.precanvas);
					var t = parseInt(e);
					t >= this.nodeId && (this.nodeId = t + 1)
				}
			}
			click(e) {
				if ("fixed" === this.editor_mode) {
					if ("parent-drawflow" !== e.target.classList[0] && "drawflow" !== e.target.classList[0]) return !1;
					this.ele_selected = e.target.closest(".parent-drawflow")
				} else this.first_click = e.target, this.ele_selected = e.target, 0 === e.button && this.contextmenuDel(), null != e.target.closest(".drawflow_content_node") && (this.ele_selected = e.target.closest(".drawflow_content_node").parentElement);
				switch (this.ele_selected.classList[0]) {
				case "drawflow-node":
					null != this.node_selected && this.node_selected.classList.remove("selected"), null != this.connection_selected && (this.connection_selected.classList.remove("selected"), this.connection_selected = null), this.dispatch("nodeSelected", this.ele_selected.id.slice(5)), this.node_selected = this.ele_selected, this.node_selected.classList.add("selected"), this.drag = !0;
					break;
				case "output":
					this.connection = !0, null != this.node_selected && (this.node_selected.classList.remove("selected"), this.node_selected = null), null != this.connection_selected && (this.connection_selected.classList.remove("selected"), this.connection_selected = null), this.drawConnection(e.target);
					break;
				case "parent-drawflow":
				case "drawflow":
					null != this.node_selected && (this.node_selected.classList.remove("selected"), this.node_selected = null), null != this.connection_selected && (this.connection_selected.classList.remove("selected"), this.connection_selected = null), this.editor_selected = !0;
					break;
				case "main-path":
					null != this.node_selected && (this.node_selected.classList.remove("selected"), this.node_selected = null), null != this.connection_selected && (this.connection_selected.classList.remove("selected"), this.connection_selected = null), this.connection_selected = this.ele_selected, this.connection_selected.classList.add("selected");
					break;
				case "drawflow-delete":
					this.node_selected && this.removeNodeId(this.node_selected.id), this.connection_selected && this.removeConnection(), null != this.node_selected && (this.node_selected.classList.remove("selected"), this.node_selected = null), null != this.connection_selected && (this.connection_selected.classList.remove("selected"), this.connection_selected = null)
				}
				"touchstart" === e.type ? (this.pos_x = e.touches[0].clientX, this.pos_y = e.touches[0].clientY) : (this.pos_x = e.clientX, this.pos_y = e.clientY)
			}
			position(e) {
				if ("touchmove" === e.type) var t = e.touches[0].clientX,
					s = e.touches[0].clientY;
				else t = e.clientX, s = e.clientY;
				if (this.connection && this.updateConnection(t, s), this.editor_selected && (n = this.canvas_x + -(this.pos_x - t), i = this.canvas_y + -(this.pos_y - s), this.dispatch("translate", {
					x: n,
					y: i
				}), this.precanvas.style.transform = "translate(" + n + "px, " + i + "px) scale(" + this.zoom + ")"), this.drag) {
					var n = (this.pos_x - t) * this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom),
						i = (this.pos_y - s) * this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom);
					this.pos_x = t, this.pos_y = s, this.ele_selected.style.top = this.ele_selected.offsetTop - i + "px", this.ele_selected.style.left = this.ele_selected.offsetLeft - n + "px", this.drawflow.drawflow[this.module].data[this.ele_selected.id.slice(5)].pos_x = this.ele_selected.offsetLeft - n, this.drawflow.drawflow[this.module].data[this.ele_selected.id.slice(5)].pos_y = this.ele_selected.offsetTop - i, this.updateConnectionNodes(this.ele_selected.id, t, s)
				}
				"touchmove" === e.type && (this.mouse_x = t, this.mouse_y = s), this.dispatch("mouseMove", {
					x: t,
					y: s
				})
			}
			dragEnd(e) {
				if (null != this.select_elements && (this.select_elements.remove(), this.select_elements = null), "touchend" === e.type) var t = this.mouse_x,
					s = this.mouse_y,
					n = document.elementFromPoint(t, s);
				else t = e.clientX, s = e.clientY, n = e.target;
				if (this.editor_selected && (this.canvas_x = this.canvas_x + -(this.pos_x - t), this.canvas_y = this.canvas_y + -(this.pos_y - s), this.editor_selected = !1), !0 === this.connection) if ("input" === n.classList[0]) {
					var i = this.ele_selected.parentElement.parentElement.id,
						o = this.ele_selected.classList[1],
						l = n.parentElement.parentElement.id,
						d = n.classList[1];
					if (i !== l) {
						if (0 === this.container.querySelectorAll(".connection.node_in_" + l + ".node_out_" + i + "." + o + "." + d).length) {
							this.connection_ele.classList.add("node_in_" + l), this.connection_ele.classList.add("node_out_" + i), this.connection_ele.classList.add(o), this.connection_ele.classList.add(d);
							var c = l.slice(5),
								a = i.slice(5);
							this.drawflow.drawflow[this.module].data[a].outputs[o].connections.push({
								node: c,
								output: d
							}), this.drawflow.drawflow[this.module].data[c].inputs[d].connections.push({
								node: a,
								input: o
							}), this.dispatch("connectionCreated", {
								ouput_id: a,
								input_id: c,
								output_class: o,
								input_class: d
							})
						} else this.connection_ele.remove();
						this.connection_ele = null
					} else this.connection_ele.remove(), this.connection_ele = null
				} else this.connection_ele.remove(), this.connection_ele = null;
				this.drag = !1, this.connection = !1, this.ele_selected = null, this.editor_selected = !1
			}
			contextmenu(e) {
				if (e.preventDefault(), "fixed" === this.editor_mode) return !1;
				if (this.precanvas.getElementsByClassName("drawflow-delete").length && this.precanvas.getElementsByClassName("drawflow-delete")[0].remove(), this.node_selected || this.connection_selected) {
					var t = document.createElement("div");
					t.classList.add("drawflow-delete"), t.innerHTML = "x", this.node_selected && this.node_selected.appendChild(t), this.connection_selected && (t.style.top = e.clientY * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) + "px", t.style.left = e.clientX * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) + "px", this.precanvas.appendChild(t))
				}
			}
			contextmenuDel() {
				this.precanvas.getElementsByClassName("drawflow-delete").length && this.precanvas.getElementsByClassName("drawflow-delete")[0].remove()
			}
			key(e) {
				if ("fixed" === this.editor_mode) return !1;
				"Delete" === e.key && (null != this.node_selected && "INPUT" !== this.first_click.tagName && "TEXTAREA" !== this.first_click.tagName && this.removeNodeId(this.node_selected.id), null != this.connection_selected && this.removeConnection())
			}
			zoom_enter(e, t) {
				e.ctrlKey && (e.preventDefault(), e.deltaY > 0 ? this.zoom_out() : this.zoom_in())
			}
			zoom_refresh() {
				this.dispatch("zoom", this.zoom), this.precanvas.style.transform = "translate(" + this.canvas_x + "px, " + this.canvas_y + "px) scale(" + this.zoom + ")"
			}
			zoom_in() {
				this.zoom < this.zoom_max && (this.zoom += .1, this.zoom_refresh())
			}
			zoom_out() {
				this.zoom > this.zoom_min && (this.zoom -= .1, this.zoom_refresh())
			}
			zoom_reset() {
				1 != this.zoom && (this.zoom = 1, this.zoom_refresh())
			}
			drawConnection(e) {
				var t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				this.connection_ele = t;
				var s = document.createElementNS("http://www.w3.org/2000/svg", "path");
				s.classList.add("main-path"), s.setAttributeNS(null, "d", ""), t.classList.add("connection"), t.appendChild(s), this.precanvas.appendChild(t)
			}
			updateConnection(e, t) {
				var s = this.connection_ele.children[0],
					n = this.ele_selected.offsetWidth / 2 + this.line_path / 2 + this.ele_selected.parentElement.parentElement.offsetLeft + this.ele_selected.offsetLeft,
					i = this.ele_selected.offsetHeight / 2 + this.line_path / 2 + this.ele_selected.parentElement.parentElement.offsetTop + this.ele_selected.offsetTop,
					o = e * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)) - this.precanvas.getBoundingClientRect().x * (this.precanvas.clientWidth / (this.precanvas.clientWidth * this.zoom)),
					l = t * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)) - this.precanvas.getBoundingClientRect().y * (this.precanvas.clientHeight / (this.precanvas.clientHeight * this.zoom)),
					d = n + .5 * Math.abs(o - n),
					c = o - .5 * Math.abs(o - n);
				s.setAttributeNS(null, "d", "M " + n + " " + i + " C " + d + " " + i + " " + c + " " + l + " " + o + "  " + l)
			}
			updateConnectionNodes(e) {
				const t = "node_in_" + e, s = "node_out_" + e;
				var n = this.line_path / 2;
				const i = document.getElementsByClassName(s);
				Object.keys(i).map((function(t, s) {
					var o = document.getElementById(e),
						l = i[t].classList[1].replace("node_in_", ""),
						d = document.getElementById(l).querySelectorAll("." + i[t].classList[4])[0],
						c = d.offsetWidth / 2 + n + d.parentElement.parentElement.offsetLeft + d.offsetLeft,
						a = d.offsetHeight / 2 + n + d.parentElement.parentElement.offsetTop + d.offsetTop,
						r = o.offsetLeft + o.querySelectorAll("." + i[t].classList[3])[0].offsetLeft + o.querySelectorAll("." + i[t].classList[3])[0].offsetWidth / 2 + n,
						h = o.offsetTop + o.querySelectorAll("." + i[t].classList[3])[0].offsetTop + o.querySelectorAll("." + i[t].classList[3])[0].offsetHeight / 2 + n,
						p = c,
						u = a,
						f = r + .5 * Math.abs(p - r),
						m = p - .5 * Math.abs(p - r);
					i[t].children[0].setAttributeNS(null, "d", "M " + r + " " + h + " C " + f + " " + h + " " + m + " " + u + " " + p + "  " + u)
				}));
				const o = document.getElementsByClassName(t);
				Object.keys(o).map((function(t, s) {
					var i = document.getElementById(e),
						l = o[t].classList[2].replace("node_out_", ""),
						d = document.getElementById(l).querySelectorAll("." + o[t].classList[3])[0],
						c = d.offsetWidth / 2 + n + d.parentElement.parentElement.offsetLeft + d.offsetLeft,
						a = d.offsetHeight / 2 + n + d.parentElement.parentElement.offsetTop + d.offsetTop,
						r = i.offsetLeft + i.querySelectorAll("." + o[t].classList[4])[0].offsetLeft + i.querySelectorAll("." + o[t].classList[4])[0].offsetWidth / 2 + n,
						h = i.offsetTop + i.querySelectorAll("." + o[t].classList[4])[0].offsetTop + i.querySelectorAll("." + o[t].classList[4])[0].offsetHeight / 2 + n,
						p = c + .5 * Math.abs(r - c),
						u = r - .5 * Math.abs(r - c);
					o[t].children[0].setAttributeNS(null, "d", "M " + c + " " + a + " C " + p + " " + a + " " + u + " " + h + " " + r + "  " + h)
				}))
			}
			registerNode(e, t, s = null, n = null) {
				this.noderegister[e] = {
					html: t,
					props: s,
					options: n
				}
			}
			addNode(e, t, s, n, i, o, l, d, c = !1) {
				const a = document.createElement("div");
				a.classList.add("parent-node");
				const r = document.createElement("div");
				r.innerHTML = "", r.setAttribute("id", "node-" + this.nodeId), r.classList.add("drawflow-node"), "" != o && r.classList.add(o);
				const h = document.createElement("div");
				h.classList.add("inputs");
				const p = document.createElement("div");
				p.classList.add("outputs");
				const u = {};
				for (var f = 0; f < t; f++) {
					const e = document.createElement("div");
					e.classList.add("input"), e.classList.add("input_" + (f + 1)), u["input_" + (f + 1)] = {
						connections: []
					}, h.appendChild(e)
				}
				const m = {};
				for (f = 0; f < s; f++) {
					const e = document.createElement("div");
					e.classList.add("output"), e.classList.add("output_" + (f + 1)), m["output_" + (f + 1)] = {
						connections: []
					}, p.appendChild(e)
				}
				const _ = document.createElement("div");
				if (_.classList.add("drawflow_content_node"), !1 === c) _.innerHTML = d;
				else if (!0 === c) _.appendChild(this.noderegister[d].html.cloneNode(!0));
				else {
					let e = new this.render({
						render: e = > e(this.noderegister[d].html, {
							props: this.noderegister[d].props
						}),
						...this.noderegister[d].options
					}).$mount();
					_.appendChild(e.$el)
				}
				Object.entries(l).forEach((function(e, t) {
					if ("object" == typeof e[1])!
					function e(t, s, n) {
						if (null === t) t = l[s];
						else t = t[s];
						Object.entries(t).forEach((function(i, o) {
							if ("object" == typeof i[1]) e(t, i[0], s + "-" + i[0]);
							else for (var l = _.querySelectorAll("[df-" + n + "-" + i[0] + "]"), d = 0; d < l.length; d++) l[d].value = i[1]
						}))
					}(null, e[0], e[0]);
					else for (var s = _.querySelectorAll("[df-" + e[0] + "]"), n = 0; n < s.length; n++) s[n].value = e[1]
				})), r.appendChild(h), r.appendChild(_), r.appendChild(p), r.style.top = i + "px", r.style.left = n + "px", a.appendChild(r), this.precanvas.appendChild(a);
				var v = {
					id: this.nodeId,
					name: e,
					data: l,
					class: o,
					html: d,
					typenode: c,
					inputs: u,
					outputs: m,
					pos_x: n,
					pos_y: i
				};
				this.drawflow.drawflow[this.module].data[this.nodeId] = v, this.dispatch("nodeCreated", this.nodeId), this.nodeId++
			}
			addNodeImport(e, t) {
				const s = document.createElement("div");
				s.classList.add("parent-node");
				const n = document.createElement("div");
				n.innerHTML = "", n.setAttribute("id", "node-" + e.id), n.classList.add("drawflow-node"), "" != e.class && n.classList.add(e.class);
				const i = document.createElement("div");
				i.classList.add("inputs");
				const o = document.createElement("div");
				o.classList.add("outputs"), Object.keys(e.inputs).map((function(s, n) {
					const o = document.createElement("div");
					o.classList.add("input"), o.classList.add(s), i.appendChild(o), Object.keys(e.inputs[s].connections).map((function(n, i) {
						var o = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
							l = document.createElementNS("http://www.w3.org/2000/svg", "path");
						l.classList.add("main-path"), l.setAttributeNS(null, "d", ""), o.classList.add("connection"), o.classList.add("node_in_node-" + e.id), o.classList.add("node_out_node-" + e.inputs[s].connections[n].node), o.classList.add(e.inputs[s].connections[n].input), o.classList.add(s), o.appendChild(l), t.appendChild(o)
					}))
				}));
				for (var l = 0; l < Object.keys(e.outputs).length; l++) {
					const e = document.createElement("div");
					e.classList.add("output"), e.classList.add("output_" + (l + 1)), o.appendChild(e)
				}
				const d = document.createElement("div");
				if (d.classList.add("drawflow_content_node"), !1 === e.typenode) d.innerHTML = e.html;
				else if (!0 === e.typenode) d.appendChild(this.noderegister[e.html].html.cloneNode(!0));
				else {
					let t = new this.render({
						render: t = > t(this.noderegister[e.html].html, {
							props: this.noderegister[e.html].props
						}),
						...this.noderegister[e.html].options
					}).$mount();
					d.appendChild(t.$el)
				}
				Object.entries(e.data).forEach((function(t, s) {
					if ("object" == typeof t[1])!
					function t(s, n, i) {
						if (null === s) s = e.data[n];
						else s = s[n];
						Object.entries(s).forEach((function(e, o) {
							if ("object" == typeof e[1]) t(s, e[0], n + "-" + e[0]);
							else for (var l = d.querySelectorAll("[df-" + i + "-" + e[0] + "]"), c = 0; c < l.length; c++) l[c].value = e[1]
						}))
					}(null, t[0], t[0]);
					else for (var n = d.querySelectorAll("[df-" + t[0] + "]"), i = 0; i < n.length; i++) n[i].value = t[1]
				})), n.appendChild(i), n.appendChild(d), n.appendChild(o), n.style.top = e.pos_y + "px", n.style.left = e.pos_x + "px", s.appendChild(n), this.precanvas.appendChild(s)
			}
			updateNodeValue(e) {
				for (var t = e.target.attributes, s = 0; s < t.length; s++) t[s].nodeName.startsWith("df-") && (this.drawflow.drawflow[this.module].data[e.target.closest(".drawflow_content_node").parentElement.id.slice(5)].data[t[s].nodeName.slice(3)] = e.target.value)
			}
			removeNodeId(e) {
				document.getElementById(e).remove(), delete this.drawflow.drawflow[this.module].data[e.slice(5)], this.dispatch("nodeRemoved", e.slice(5)), this.removeConnectionNodeId(e)
			}
			removeConnection() {
				if (null != this.connection_selected) {
					var e = this.connection_selected.parentElement.classList;
					this.connection_selected.parentElement.remove();
					var t = this.drawflow.drawflow[this.module].data[e[2].slice(14)].outputs[e[3]].connections.findIndex((function(t, s) {
						return t.node === e[1].slice(13) && t.output === e[4]
					}));
					this.drawflow.drawflow[this.module].data[e[2].slice(14)].outputs[e[3]].connections.splice(t, 1);
					var s = this.drawflow.drawflow[this.module].data[e[1].slice(13)].inputs[e[4]].connections.findIndex((function(t, s) {
						return t.node === e[2].slice(14) && t.input === e[3]
					}));
					this.drawflow.drawflow[this.module].data[e[1].slice(13)].inputs[e[4]].connections.splice(s, 1), this.dispatch("connectionRemoved", {
						ouput_id: e[2].slice(14),
						input_id: e[1].slice(13),
						ouput_class: e[3],
						input_class: e[4]
					}), this.connection_selected = null
				}
			}
			removeConnectionNodeId(e) {
				const t = "node_in_" + e, s = "node_out_" + e, n = document.getElementsByClassName(s);
				for (var i = n.length - 1; i >= 0; i--) {
					var o = n[i].classList,
						l = this.drawflow.drawflow[this.module].data[o[1].slice(13)].inputs[o[4]].connections.findIndex((function(e, t) {
							return e.node === o[2].slice(14) && e.input === o[3]
						}));
					this.drawflow.drawflow[this.module].data[o[1].slice(13)].inputs[o[4]].connections.splice(l, 1), n[i].remove()
				}
				const d = document.getElementsByClassName(t);
				for (i = d.length - 1; i >= 0; i--) {
					o = d[i].classList;
					var c = this.drawflow.drawflow[this.module].data[o[2].slice(14)].outputs[o[3]].connections.findIndex((function(e, t) {
						return e.node === o[1].slice(13) && e.output === o[4]
					}));
					this.drawflow.drawflow[this.module].data[o[2].slice(14)].outputs[o[3]].connections.splice(c, 1), d[i].remove()
				}
			}
			addModule(e) {
				this.dispatch("moduleCreated", e), this.drawflow.drawflow[e] = {
					data: {}
				}
			}
			changeModule(e) {
				this.dispatch("moduleChanged", e), this.module = e, this.precanvas.innerHTML = "", this.canvas_x = 0, this.canvas_y = 0, this.pos_x = 0, this.pos_y = 0, this.mouse_x = 0, this.mouse_y = 0, this.zoom = 1, this.precanvas.style.transform = "", this.import(this.drawflow)
			}
			clearModuleSelected() {
				this.precanvas.innerHTML = "", this.drawflow.drawflow[this.module] = {
					data: {}
				}
			}
			clear() {
				this.precanvas.innerHTML = "", this.drawflow = {
					drawflow: {
						Home: {
							data: {}
						}
					}
				}
			}
			export() {
				return JSON.parse(JSON.stringify(this.drawflow))
			}
			import(e) {
				this.clear(), this.drawflow = JSON.parse(JSON.stringify(e)), this.load()
			}
			on(e, t) {
				return "function" != typeof t ? (console.error("The listener callback must be a function, the given type is " + typeof t), !1) : "string" != typeof e ? (console.error("The event name must be a string, the given type is " + typeof e), !1) : (void 0 === this.events[e] && (this.events[e] = {
					listeners: []
				}), void this.events[e].listeners.push(t))
			}
			removeListener(e, t) {
				if (void 0 === this.events[e]) return !1;
				this.events[e].listeners = this.events[e].listeners.filter(e = > e.toString() !== t.toString())
			}
			dispatch(e, t) {
				if (void 0 === this.events[e]) return !1;
				this.events[e].listeners.forEach(e = > {
					e(t)
				})
			}
		}
	}]).
default
}));