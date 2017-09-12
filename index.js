const codeA = document.getElementById("codeArea")
const runA = document.getElementById("runArea")
const stackA = document.getElementById("stackArea")
const outputA = document.getElementById("outputArea")
let isContinue = false
let isRunning = false
let step = 0

function run(interval) {
	if(isRunning)return
	isRunning = true
	stackA.innerText = String.fromCharCode(160)
	outputA.innerText = String.fromCharCode(160)
	const code = codeA.value.split("\n")
	const codeASCII = []
	for(let i = 0; i < code.length; i++) {
		codeASCII.push([])
	}
	let maxStrLength = 0
	code.forEach((v, i) => {
		if(maxStrLength <= v.length)maxStrLength = v.length
	})
	code.forEach((v, i) => {
		for(let k = v.length; k < maxStrLength; k++) {
			code[i] += " "
		}
	})
	code.forEach((v, i) => {
		code[i] = v.replace(/\s/g, String.fromCharCode(160))
		Array.prototype.forEach.call(v, (w, j) => {
			codeASCII[i][j] = w.charCodeAt()
		})
	})
	update = () => {
		runA.innerHTML = ""
		codeASCII.forEach((v, i) => {
			runA.innerHTML += "<div>"
			Array.prototype.forEach.call(v, (w, j) => {
				let altChar
				if(33 <= w && w <= 126) {
					altChar = String.fromCharCode(w)
				} else if(w === 32) {
					altChar = String.fromCharCode(160)
				} else {
					altChar = "?"
				}
				runA.innerHTML += "<span id='" + j + "-" + i + "'>" + altChar + "</span>"
			})
			runA.innerHTML += "</div>"	// なんかうまくいってない
		})
		// runA.innerText = code.join("\n")
	}
	update()
	if(codeA.value.trim() === "")return
	const stack = []
	const coord = [0, 0]	// coord = [x, y]
	const diff = [1, 0]
	let isPushingASCII = false
	let isSkipNext = false
	isContinue = true
	// while(isContinue) {
	setInterval(() => {
		if(!isContinue) {
			isRunning = false
			return
		}
		[].forEach.call(document.getElementsByTagName("span"), (v, i) => {
			v.setAttribute("class", "")
		})
		document.getElementById(coord[0] + "-" + coord[1]).setAttribute("class", "focus")
		// if(!isSkipNext && step > 0) {
		if(!isSkipNext) {
			const char = code[coord[1]][coord[0]]
			if(char.match(/\d/) !== null) {
				stack.push(Number(char))
			}
			if(isPushingASCII) {
				stack.push(char.charCodeAt())
			}
			switch(char) {
				case "<":
					diff[0] = -1
					diff[1] = 0
					break
				case ">":
					diff[0] = 1
					diff[1] = 0
					break
				case "^":
					diff[0] = 0
					diff[1] = -1
					break
				case "v":
					diff[0] = 0
					diff[1] = 1
					break
				case "_":
					if(!stack.pop()) {
						diff[0] = 1
						diff[1] = 0
					} else {
						diff[0] = -1
						diff[1] = 0
					}
					break
				case "|":
					if(!stack.pop()) {
						diff[0] = 0
						diff[1] = 1
					} else {
						diff[0] = 0
						diff[1] = -1
					}
					break
				case "?":
					const directionInt = Math.random() * 4 | 0
					switch(directionInt) {
						case 0:
							diff[0] = -1
							diff[1] = 0
							break
						case 1:
							diff[0] = 1
							diff[1] = 0
							break
						case 2:
							diff[0] = 0
							diff[1] = -1
							break
						case 3:
							diff[0] = 0
							diff[1] = 1
							break
					}
					break
				case " ":
					break
				case "#":
					isSkipNext = true
					break
				case "@":
					isContinue = false
					break
				case '"':
					isPushingASCII = !isPushingASCII
					stack.pop()	// クソかも
					break
				case "&":
					let again = true
					let input = null
					while(again) {
						input = Number(prompt("Input an Integer"))
						if(!isNaN(input))again = false
					}
					stack.push(input)
					break
				case "~":
					stack.push(prompt("Input an Character").charCodeAt(0))
					break
				case ".":
					if(outputA.innerText.length === 1)outputA.innerText = ""
					outputA.innerText += stack.pop().toString() + String.fromCharCode(160)
					break
				case ",":
					if(outputA.innerText.length === 1)outputA.innerText = ""
					outputA.innerText += String.fromCharCode(stack.pop()) + String.fromCharCode(160)
					break
				case "+":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x + y)
					break
				case "-":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x - y)
					break
				case "*":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x * y)
					break
				case "/":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x / y | 0)
					break
				case "%":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x % y)
					break
				case "`":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(x > y ? 1 : 0)
					break
				case "!":
					stack.push(stack.pop() ? 0 : 1)
					break
				case ":":
					const popped = stack.pop()
					stack.push(popped)
					stack.push(popped)
					break
				case "\\":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(y)
					stack.push(x)
					break
				case "$":
					stack.pop()
					break
				case "g":
					var y = stack.pop()
					var x = stack.pop()
					stack.push(codeASCII[x][y].toString().charCodeAt(0))
					break
				case "p":
					var y = stack.pop()
					var x = stack.pop()
					var v = stack.pop()
					codeASCII[x][y] = String.fromCharCode(v)
					update()
					break
			}
		} else {
			isSkipNext = false
		}
		console.log(coord, stack)
		stackA.innerText = stack.join(String.fromCharCode(160))
		// console.log(code)

		// update

		// if(step > 0) {
		// 	coord[0] += diff[0]
		// 	coord[1] += diff[1]
		// 	step--
		// }

		coord[0] += diff[0]
		coord[1] += diff[1]
		if(coord[0] === code[0].length) {
			coord[0] = 0
		}
		if(coord[0] === -1) {
			coord[0] = 0
		}
		if(coord[1] === code.length) {
			coord[1] = 0
		}
		if(coord[1] === -1) {
			coord[1] = code.length - 1
		}
	}, interval);
	// }
}
