import * as fs from 'fs'
import * as path from 'path'
import { createMacro, MacroError } from 'babel-plugin-macros'
import regexgen from 'regexgen'
import pkg from '../package.json'

const flatMap = (iteratee, arr) => [].concat(...arr.map(iteratee))

const strToWords = str => str.trim().split(/\s+/)

const pathToWords = path => {
  if (path.isStringLiteral()) {
    return strToWords(path.node.value)
  }

  if (path.isTemplateLiteral()) {
    return strToWords(path.node.quasis[0].value.cooked)
  }

  if (path.isArrayExpression()) {
    return path.get('elements').map(element => {
      if (element.isStringLiteral()) {
        return element.node.value.trim()
      }

      if (element.isTemplateLiteral()) {
        return element.node.quasis[0].value.cooked.trim()
      }

      throw new MacroError(
        `${pkg.name} can't handle ${element.node.type} as array element.`,
      )
    })
  }

  if (path.isObjectExpression()) {
    return path.get('properties').map(property => {
      if (property.node.computed) {
        throw new MacroError(
          `${pkg.name} can't handle computed object properties.`,
        )
      }

      const key = property.get('key')

      if (key.isStringLiteral()) {
        return key.node.value.trim()
      }

      if (key.isIdentifier()) {
        return key.node.name
      }

      throw new MacroError(
        `${pkg.name} can't handle ${key.node.type} as object property.`,
      )
    })
  }

  if (path.isIdentifier()) {
    const identifierPath = path.scope.getBinding(path.node.name).path

    if (!identifierPath.isVariableDeclarator()) {
      throw new MacroError(`${pkg.name} can only handle declared variables.`)
    }

    return getWords([identifierPath.get('init')])
  }

  throw new MacroError(`${pkg.name} can't handle ${path.node.type}.`)
}

const getWords = paths => flatMap(pathToWords, paths)

const isRegExpConstructor = path =>
  path.isNewExpression() && path.get('callee').node.name === 'RegExp'
const isInRegExpConstructor = path =>
  isRegExpConstructor(path.find(p => isRegExpConstructor(p) || p.isStatement()))

const tryConcatenating = (path, concatenated) => {
  let { key } = path
  path = path.parentPath

  do {
    if (path.isBinaryExpression()) {
      if (key === 'left') {
        const right = path.get('right')

        if (!right.isStringLiteral()) {
          return null
        }

        concatenated += right.node.value
      } else {
        const left = path.get('left')

        if (!left.isStringLiteral()) {
          return null
        }

        concatenated = left.node.value + concatenated
      }
    } else if (path.isTemplateLiteral()) {
      if (key !== 0) {
        return null
      }

      concatenated =
        path.get('quasis')[0].node.value.cooked +
        concatenated +
        path.get('quasis')[1].node.value.cooked
    } else {
      return null
    }

    ;({ key } = path)
    path = path.parentPath
  } while (!isRegExpConstructor(path))

  return concatenated
}

const regexgenMacro = ({
  references,
  state: {
    file: {
      opts: { filename },
    },
  },
  babel: { types: t },
}) => {
  const usedReferences = Object.keys(references)

  if (usedReferences.length > 1 || usedReferences[0] !== 'default') {
    throw new MacroError(
      `${
        pkg.name
      } must be used as default import, instead you have used it as: ${usedReferences.join(
        ', ',
      )}.`,
    )
  }

  references.default.forEach(({ parentPath: regexgenCall }) => {
    if (!regexgenCall.isCallExpression()) {
      throw new MacroError(
        `${
          pkg.name
        } should be used as function call, instead you have used it as part of ${
          regexgenCall.node.type
        }.`,
      )
    }

    const words = getWords(regexgenCall.get('arguments'))
    const compiledRegExp = regexgen(words).source

    if (isInRegExpConstructor(regexgenCall)) {
      const concatenated = tryConcatenating(regexgenCall, compiledRegExp)

      if (concatenated) {
        const regExpConstructor = regexgenCall.find(p => isRegExpConstructor(p))
        const flags = regExpConstructor.get('arguments.1')
        regExpConstructor.replaceWith(
          t.regExpLiteral(concatenated, flags && flags.node.value),
        )
        return
      }

      regexgenCall.replaceWith(t.stringLiteral(compiledRegExp))
      return
    }

    regexgenCall.replaceWith(t.regExpLiteral(compiledRegExp))
  })
}

export default createMacro(regexgenMacro)
