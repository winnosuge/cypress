/* eslint-disable
    default-case,
    no-case-declarations,
    no-cond-assign,
    no-const-assign,
    no-dupe-keys,
    one-var,
    prefer-rest-params,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */


import _ from 'lodash'
import { ThrowStatement } from 'babel-types';
import $ from 'jquery'
import $jquery from './jquery'
import $window from './window'
import $document from './document'
import $utils from '../cypress/utils.coffee'

const fixedOrStickyRe = /(fixed|sticky)/

const focusable = 'body,a[href],link[href],button,select,[tabindex],input,textarea,[contenteditable]'

const inputTypeNeedSingleValueChangeRe = /^(date|time|week|month)$/
const canSetSelectionRangeElementRe = /^(text|search|URL|tel|password)$/

declare global {
  interface Window {
    Element: typeof Element
    HTMLElement: typeof HTMLElement
    HTMLInputElement: typeof HTMLInputElement
    HTMLSelectElement: typeof HTMLSelectElement
    HTMLButtonElement: typeof HTMLButtonElement
    HTMLOptionElement: typeof HTMLOptionElement
    HTMLTextAreaElement: typeof HTMLTextAreaElement
    Selection: typeof Selection
    SVGElement: typeof SVGElement
    EventTarget: typeof EventTarget
    Document: typeof Document
  }

  interface Selection {
    modify: Function
  }
}



// rules for native methods and props
// if a setter or getter or function then add a native method
// if a traversal, don't

const descriptor = <T extends keyof Window, K extends keyof Window[T]['prototype']>(klass:T, prop:K) => {
  const descriptor = Object.getOwnPropertyDescriptor(window[klass].prototype, prop)

  if (descriptor === undefined) {
    throw new Error(`Error, could not get property descriptor for ${klass}  ${prop}. This should never happen`)
  }
  return descriptor
}

const _getValue = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'value').get
  }

  if (isTextarea(this)) {
    return descriptor('HTMLTextAreaElement', 'value').get
  }

  if (isSelect(this)) {
    return descriptor('HTMLSelectElement', 'value').get
  }

  if (isButton(this)) {
    return descriptor('HTMLButtonElement', 'value').get
  }

  // is an option element
  return descriptor('HTMLOptionElement', 'value').get
}

const _setValue = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'value').set
  }

  if (isTextarea(this)) {
    return descriptor('HTMLTextAreaElement', 'value').set
  }

  if (isSelect(this)) {
    return descriptor('HTMLSelectElement', 'value').set
  }

  if (isButton(this)) {
    return descriptor('HTMLButtonElement', 'value').set
  }

  // is an options element
  return descriptor('HTMLOptionElement', 'value').set
}

const _getSelectionStart = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'selectionStart').get
  }

  if (isTextarea(this)) {
    return descriptor('HTMLTextAreaElement', 'selectionStart').get
  }
  throw new Error('this should never happen, cannot get selectionStart')
}

const _getSelectionEnd = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'selectionEnd').get
  }

  if (isTextarea(this)) {
    return descriptor('HTMLTextAreaElement', 'selectionEnd').get
  }
  throw new Error('this should never happen, cannot get selectionEnd')

}

const _nativeFocus = function () {
  if ($window.isWindow(this)) {
    return window.focus
  }

  if (isSvg(this)) {
    return window.SVGElement.prototype.focus
  }

  return window.HTMLElement.prototype.focus
}

const _nativeBlur = function () {
  if ($window.isWindow(this)) {
    return window.blur
  }

  if (isSvg(this)) {
    return window.SVGElement.prototype.blur
  }

  return window.HTMLElement.prototype.blur
}

const _nativeSetSelectionRange = function () {
  if (isInput(this)) {
    return window.HTMLInputElement.prototype.setSelectionRange
  }

  // is textarea
  return window.HTMLTextAreaElement.prototype.setSelectionRange
}

const _nativeSelect = function () {
  if (isInput(this)) {
    return window.HTMLInputElement.prototype.select
  }

  // is textarea
  return window.HTMLTextAreaElement.prototype.select
}

const _isContentEditable = function () {
  if (isSvg(this)) {
    return false
  }

  return descriptor('HTMLElement', 'isContentEditable').get
}

const _setType = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'type').set
  }

  if (isButton(this)) {
    return descriptor('HTMLButtonElement', 'type').set
  }
  throw new Error('this should never happen, cannot set type')

}

const _getType = function () {
  if (isInput(this)) {
    return descriptor('HTMLInputElement', 'type').get
  }

  if (isButton(this)) {
    return descriptor('HTMLButtonElement', 'type').get
  }
  throw new Error('this should never happen, cannot get type')

}

const nativeGetters = {
  value: _getValue,
  isContentEditable: _isContentEditable,
  isCollapsed: descriptor('Selection', 'isCollapsed').get,
  selectionStart: _getSelectionStart,
  selectionEnd: _getSelectionEnd,
  type: _getType,
  activeElement: descriptor('Document', 'activeElement').get,
  body: descriptor('Document', 'body').get,
}

const nativeSetters = {
  value: _setValue,
  type: _setType,
}

const nativeMethods = {
  addEventListener: window.EventTarget.prototype.addEventListener,
  removeEventListener: window.EventTarget.prototype.removeEventListener,
  createRange: window.document.createRange,
  getSelection: window.document.getSelection,
  removeAllRanges: window.Selection.prototype.removeAllRanges,
  addRange: window.Selection.prototype.addRange,
  execCommand: window.document.execCommand,
  getAttribute: window.Element.prototype.getAttribute,
  setSelectionRange: _nativeSetSelectionRange,
  modify: window.Selection.prototype.modify,
  focus: _nativeFocus,
  blur: _nativeBlur,
  select: _nativeSelect,
}

const tryCallNativeMethod = (obj, fn, ...args) => {
  try {
    return callNativeMethod(obj, fn, ...args)
  } catch (err) {
    return
  }
}

const callNativeMethod = function (obj, fn, ...args) {
  const nativeFn = nativeMethods[fn]

  if (!nativeFn) {
    const fns = _.keys(nativeMethods).join(', ')

    throw new Error(`attempted to use a native fn called: ${fn}. Available fns are: ${fns}`)
  }

  let retFn = nativeFn.apply(obj, args)

  if (_.isFunction(retFn)) {
    retFn = retFn.apply(obj, args)
  }

  return retFn
}

// const b = getNativeProp({foo:{hello:'world'}}, 'foo')

const getNativeProp = function<T, K extends keyof T>(obj:T, prop:K): T[K] {
  const nativeProp = nativeGetters[prop as string]

  if (!nativeProp) {
    const props = _.keys(nativeGetters).join(', ')

    throw new Error(`attempted to use a native getter prop called: ${prop}. Available props are: ${props}`)
  }

  let retProp = nativeProp.call(obj, prop)

  if (_.isFunction(retProp)) {
    // if we got back another function
    // then invoke it again
    retProp = retProp.call(obj, prop)
  }

  return retProp
}



const setNativeProp = function <T, K extends keyof T>(obj:T, prop:K, val) {
  const nativeProp = nativeSetters[prop as string]

  if (!nativeProp) {
    const fns = _.keys(nativeSetters).join(', ')

    throw new Error(`attempted to use a native setter prop called: ${prop}. Available props are: ${fns}`)
  }

  let retProp = nativeProp.call(obj, val)

  if (_.isFunction(retProp)) {
    retProp = retProp.call(obj, val)
  }

  return retProp
}


export interface HTMLSingleValueChangeInputElement extends HTMLInputElement {
  type: 'date'|'time'|'week'|'month'
}

const isNeedSingleValueChangeInputElement = (el:HTMLElement): el is HTMLSingleValueChangeInputElement  => {
  if (!isInput(el)) {
    return false
  }

  return inputTypeNeedSingleValueChangeRe.test(el.type)
}

const isTextEditableEl = (el) => {
  return isInput(el) || isTextarea(el) || isContentEditable(el)
}

const canSetSelectionRangeElement = (el): el is HTMLElementCanSetSelectionRange => {
  return isTextarea(el) || (isInput(el) && canSetSelectionRangeElementRe.test(getNativeProp(el, 'type')))
}

const getTagName = (el) => {
  const tagName = el.tagName || ''

  return tagName.toLowerCase()
}

// this property is the tell-all for contenteditable
// should be true for elements:
//   - with [contenteditable]
//   - with document.designMode = 'on'
const isContentEditable = (el:HTMLElement): el is HTMLContentEditableElement => {
  return getNativeProp(el, 'isContentEditable')
}

const isTextarea = (el): el is HTMLTextAreaElement => {
  return getTagName(el) === 'textarea'
}

const isInput = (el): el is HTMLInputElement => {
  return getTagName(el) === 'input'
}

const isButton = (el): el is HTMLButtonElement => {
  return getTagName(el) === 'button'
}

const isSelect = (el): el is HTMLSelectElement => {
  return getTagName(el) === 'select'
}

const isBody = (el): el is HTMLBodyElement => {
  return getTagName(el) === 'body'
}

const isSvg = function (el): el is SVGElement {
  try {
    return 'ownerSVGElement' in el
  } catch (error) {
    return false
  }
}

// active element is the default if its null
// or its equal to document.body
const activeElementIsDefault = (activeElement, body) => {
  return (!activeElement) || (activeElement === body)
}

const isFocused = (el) => {
  try {
    const doc = $document.getDocumentFromElement(el)

    const { activeElement, body } = doc

    if (activeElementIsDefault(activeElement, body)) {
      return false
    }

    return doc.activeElement === el
  } catch (err) {
    return false
  }
}

const getFocusedByDocument = (doc:Document):Element|null => {
  const activeElement = getNativeProp(doc, 'activeElement')

  if (isFocused(activeElement)) {
    return activeElement
  }
  return null
}

const isElement = function (obj): obj is HTMLElement | JQuery<HTMLElement> {
  try {
    if ($jquery.isJquery(obj)) {
      obj = obj[0]
    }

    return Boolean(obj && _.isElement(obj))
  } catch (error) {
    return false
  }
}

const isFocusable = ($el) => {
  return $el.is(focusable)
}

const isType = function (el:HTMLInputElement| HTMLInputElement[] | JQuery<HTMLInputElement>, type) {
  el = ([] as HTMLInputElement[]).concat($jquery.unwrap(el))[0]

  // NOTE: use DOMElement.type instead of getAttribute('type') since
  //       <input type="asdf"> will have type="text", and behaves like text type
  const elType = (getNativeProp(el, 'type') || '').toLowerCase()

  if (_.isArray(type)) {
    return _.includes(type, elType)
  }

  return elType === type
}

const isScrollOrAuto = (prop) => {
  return (prop === 'scroll') || (prop === 'auto')
}

const isAncestor = ($el, $maybeAncestor) => {
  return $el.parents().index($maybeAncestor) >= 0
}

const getFirstCommonAncestor = (el1, el2) => {
  const el1Ancestors = [el1].concat(getAllParents(el1))
  let curEl = el2

  while (curEl) {
    if (el1Ancestors.indexOf(curEl) !== -1) {
      return curEl
    }

    curEl = curEl.parentNode
  }

  return curEl
}

const getAllParents = (el:HTMLElement) => {
  let curEl = el.parentElement
  const allParents:HTMLElement[] = []

  while (curEl) {
    allParents.push(curEl)
    curEl = curEl.parentElement
  }

  return allParents
}

const isSelector = ($el, selector) => {
  return $el.is(selector)
}

const isDetached = ($el) => {
  return !isAttached($el)
}

const isAttached = function ($el) {
  // if we're being given window
  // then these are automaticallyed attached
  if ($window.isWindow($el)) {
    // there is a code path when forcing focus and
    // blur on the window where this check is necessary.
    return true
  }

  // if this is a document we can simply check
  // whether or not it has a defaultView (window).
  // documents which are part of stale pages
  // will have this property null'd out
  if ($document.isDocument($el)) {
    return $document.hasActiveWindow($el)
  }

  // normalize into an array
  const els = [].concat($jquery.unwrap($el))

  // we could be passed an empty array here
  // which in that case it is not attached
  if (els.length === 0) {
    return false
  }

  // get the document from the first element
  const doc = $document.getDocumentFromElement(els[0])

  // TODO: i guess its possible each element
  // is technically bound to a differnet document
  // but c'mon
  const isIn = (el) => {
    return $.contains(doc as unknown as Element, el)
  }

  // make sure the document is currently
  // active (it has a window) and
  // make sure every single element
  // is attached to this document
  return $document.hasActiveWindow(doc) && _.every(els, isIn)
}

/**
 * @param {HTMLElement} el
 */
const isDetachedEl = (el) => {
  return !isAttachedEl(el)
}

/**
 * @param {HTMLElement} el
 */
const isAttachedEl = function (el) {
  return isAttached($(el))
}

const isSame = function ($el1, $el2) {
  const el1 = $jquery.unwrap($el1)
  const el2 = $jquery.unwrap($el2)

  return el1 && el2 && _.isEqual(el1, el2)
}

export interface HTMLContentEditableElement extends HTMLElement {}

export interface HTMLTextLikeInputElement extends HTMLElement {
  type: 'text' |
    'password' |
    'email' |
    'number' |
    'date' |
    'week' |
    'month' |
    'time' |
    'datetime' |
    'datetime-local' |
    'search' |
    'url' |
    'tel'
  setSelectionRange : HTMLInputElement['setSelectionRange'] | ThrowStatement
}

export interface HTMLElementCanSetSelectionRange extends HTMLElement {
  setSelectionRange: HTMLInputElement['setSelectionRange']
}

export type HTMLTextLikeElement = HTMLTextAreaElement | HTMLTextLikeInputElement | HTMLContentEditableElement

const isTextLike = function ($el): $el is JQuery<HTMLTextLikeElement> {
  const sel = (selector) => {
    return isSelector($el, selector)
  }
  const type = (type) => {
    return isType($el, type)
  }

  const isContentEditableElement = isContentEditable($el.get(0))

  return _.some([
    isContentEditableElement,
    sel('textarea'),
    sel(':text'),
    type('text'),
    type('password'),
    type('email'),
    type('number'),
    type('date'),
    type('week'),
    type('month'),
    type('time'),
    type('datetime'),
    type('datetime-local'),
    type('search'),
    type('url'),
    type('tel'),
  ])
}

const isScrollable = ($el) => {
  const checkDocumentElement = (win, documentElement) => {
    // Check if body height is higher than window height
    if (win.innerHeight < documentElement.scrollHeight) {
      return true
    }

    // Check if body width is higher than window width
    if (win.innerWidth < documentElement.scrollWidth) {
      return true
    }

    // else return false since the window is not scrollable
    return false
  }

  // if we're the window, we want to get the document's
  // element and check its size against the actual window
  if ($window.isWindow($el)) {
    const win = $el

    return checkDocumentElement(win, win.document.documentElement)
  }

  // if we're any other element, we do some css calculations
  // to see that the overflow is correct and the scroll
  // area is larger than the actual height or width
  const el = $el[0]

  const { overflow, overflowY, overflowX } = window.getComputedStyle(el)

  // y axis
  // if our content height is less than the total scroll height
  if (el.clientHeight < el.scrollHeight) {
    // and our element has scroll or auto overflow or overflowX
    if (isScrollOrAuto(overflow) || isScrollOrAuto(overflowY)) {
      return true
    }
  }

  // x axis
  if (el.clientWidth < el.scrollWidth) {
    if (isScrollOrAuto(overflow) || isScrollOrAuto(overflowX)) {
      return true
    }
  }

  return false
}

const getFromDocCoords = (x:number, y:number, win:Window) => {
  return {
    x: +win.scrollX + x,
    y: +win.scrollY + y,
  }
}

const isDescendent = ($el1, $el2) => {
  if (!$el2) {
    return false
  }

  return !!(($el1.get(0) === $el2.get(0)) || $el1.has($el2).length)
}

// in order to simulate actual user behavior we need to do the following:
// 1. take our element and figure out its center coordinate
// 2. check to figure out the element listed at those coordinates
// 3. if this element is ourself or our descendants, click whatever was returned
// 4. else throw an error because something is covering us up
const getFirstFocusableEl = ($el) => {
  if (isFocusable($el)) {
    return $el
  }

  const parent = $el.parent()

  // if we have no parent then just return
  // the window since that can receive focus
  if (!parent.length) {
    const win = $window.getWindowByElement($el.get(0))

    return $(win)
  }

  return getFirstFocusableEl($el.parent())
}

const getFirstFixedOrStickyPositionParent = ($el) => {
  // return null if we're at body/html
  // cuz that means nothing has fixed position
  if (!$el || $el.is('body,html')) {
    return null
  }

  // if we have fixed position return ourselves
  if (fixedOrStickyRe.test($el.css('position'))) {
    return $el
  }

  // else recursively continue to walk up the parent node chain
  return getFirstFixedOrStickyPositionParent($el.parent())
}

const getFirstStickyPositionParent = ($el) => {
  // return null if we're at body/html
  // cuz that means nothing has sticky position
  if (!$el || $el.is('body,html')) {
    return null
  }

  // if we have sticky position return ourselves
  if ($el.css('position') === 'sticky') {
    return $el
  }

  // else recursively continue to walk up the parent node chain
  return getFirstStickyPositionParent($el.parent())
}

const getFirstScrollableParent = ($el) => {
  // this may be null or not even defined in IE
  // scrollingElement = doc.scrollingElement

  const search = ($el) => {
    const $parent = $el.parent()

    // we have no more parents
    if (!($parent || $parent.length)) {
      return null
    }

    // we match the scrollingElement
    // if $parent[0] is scrollingElement
    //   return $parent

    // instead of fussing with scrollingElement
    // we'll simply return null here and let our
    // caller deal with situations where they're
    // needing to scroll the window or scrollableElement
    if ($parent.is('html,body') || $document.isDocument($parent)) {
      return null
    }

    if (isScrollable($parent)) {
      return $parent
    }

    return search($parent)
  }

  return search($el)
}

const getElements = ($el) => {
  // bail if no $el or length
  if (!_.get($el, 'length')) {
    return
  }

  // unroll the jquery object
  const els = $jquery.unwrap($el)

  if (els.length === 1) {
    return els[0]
  }

  return els

}

const getContainsSelector = (text, filter = '') => {
  const escapedText = $utils.escapeQuotes(text)

  return `${filter}:not(script):contains('${escapedText}'), ${filter}[type='submit'][value~='${escapedText}']`
}

const priorityElement = 'input[type=\'submit\'], button, a, label'

const getFirstDeepestElement = (elements, index = 0) => {
  // iterate through all of the elements in pairs
  // and check if the next item in the array is a
  // descedent of the current. if it is continue
  // to recurse. if not, or there is no next item
  // then return the current
  const $current = elements.slice(index, index + 1)
  const $next = elements.slice(index + 1, index + 2)

  if (!$next) {
    return $current
  }

  // does current contain next?
  if ($.contains($current.get(0), $next.get(0))) {
    return getFirstDeepestElement(elements, index + 1)
  }

  // return the current if it already is a priority element
  if ($current.is(priorityElement)) {
    return $current
  }

  // else once we find the first deepest element then return its priority
  // parent if it has one and it exists in the elements chain
  const $priorities = elements.filter($current.parents(priorityElement))

  if ($priorities.length) {
    return $priorities.last()
  }

  return $current

}

// short form css-inlines the element
// long form returns the outerHTML
const stringify = (el, form = 'long') => {
  // if we are formatting the window object
  if ($window.isWindow(el)) {
    return '<window>'
  }

  // if we are formatting the document object
  if ($document.isDocument(el)) {
    return '<document>'
  }

  // convert this to jquery if its not already one
  const $el = $jquery.wrap(el)

  const long = () => {
    const str = $el.clone().empty().prop('outerHTML')
    // @ts-ignore
    const text = _.chain($el.text()).clean().truncate({ length: 10 }).value()
    const children = $el.children().length

    if (children) {
      return str.replace('></', '>...</')
    }

    if (text) {
      return str.replace('></', `>${text}</`)
    }

    return str
  }

  const short = () => {
    const id = $el.prop('id')
    const klass = $el.attr('class')
    let str = $el.prop('tagName').toLowerCase()

    if (id) {
      str += `#${id}`
    }

    // using attr here instead of class because
    // svg's return an SVGAnimatedString object
    // instead of a normal string when calling
    // the property 'class'
    if (klass) {
      str += `.${klass.split(/\s+/).join('.')}`
    }

    // if we have more than one element,
    // format it so that the user can see there's more
    if ($el.length > 1) {
      return `[ <${str}>, ${$el.length - 1} more... ]`
    }

    return `<${str}>`
  }

  return $utils.switchCase(form, {
    long,
    short,
  })
}

export {
  isElement,

  isSelector,

  isScrollOrAuto,

  isFocusable,

  isAttached,

  isDetached,

  isAttachedEl,

  isDetachedEl,

  isAncestor,

  isScrollable,

  isTextLike,

  isTextEditableEl,

  isDescendent,

  isContentEditable,

  isSame,

  isBody,

  isInput,

  isTextarea,

  isType,

  isFocused,

  isNeedSingleValueChangeInputElement,

  canSetSelectionRangeElement,

  stringify,

  getNativeProp,

  setNativeProp,

  callNativeMethod,

  tryCallNativeMethod,

  getElements,

  getFromDocCoords,

  getFirstFocusableEl,

  getFocusedByDocument,

  getContainsSelector,

  getFirstDeepestElement,

  getFirstCommonAncestor,

  getFirstFixedOrStickyPositionParent,

  getFirstStickyPositionParent,

  getFirstScrollableParent,
}