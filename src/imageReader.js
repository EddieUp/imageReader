
/**
 * 
 * 
 * @param {any} inputel 
 * @param {any} options 
 */
const imageReader = (inputel, options) => {
  if (typeof inputel !== 'object' || typeof options !== 'object') {
    console.log('参数传入类型错误')
    return
  }
  if (typeof FileReader === 'undefined') {
    console.log('浏览器不支持FileReader')
    return
  }
  let acceptType = null
  let acceptOption = null
  const acceptParams = {
    accper: String,
    maxSize: Number,
    zip: Boolean,
    zipWidth: Number,
    zipQuality: Number,
    readAs: String,
    loadStart: Function,
    loadEnd: Function,
    error: Function,
    success: Function
  }
  for (let key in options) {
    acceptOption = options[key]
    acceptType = acceptParams[key]
    if (Object.prototype.toString.call(acceptOption).indexOf(acceptType.prototype.constructor.name) === -1) {
      console.log('参数传入类型错误')
      return
    }
  }
  let inputEl = inputel
  let accept = options.accpet || 'image'
  let maxSzie = options.maxSize || 1024 * 1024 * 3
  let isZip = options.zip || false
  let zipWidth = options.zipWidth || 1
  let zipQuality = options.zipQuality || 0.7
  let readAs = options.readAs ? options.readAs.toLowerCase() : 'dataurl'
  let loadStart = options.loadStart || ''
  let loadEnd = options.loadEnd || ''
  let callError = options.error || ((str) => console.log(str))
  let callSuccess = options.success || console.log('success')
  let maxLength = 0
  let compressed = []
  let compressedHandle = []
  let fileType = 'image/jpeg'
  if (zipQuality > 1 || zipQuality < 0) {
    callError('图片质量参数在0-1之间')
    return
  }
  const fileLoad = () => {
    compressed = []
    compressedHandle = []
    let files = inputEl.files
    maxLength = files.length
    if (maxLength === 0) return
    for (let i = 0; i < maxLength; i++) {
      let fetchFile = files[i]
      let type = fileType = fetchFile.type
      let size = fetchFile.size
      if (!isZip && size > maxSzie) {
        callError('文件超出设置的最高大小：' + maxSzie)
        return
      }
      if (accept === 'image' && type.indexOf('image') === -1) {
        callError('文件格式不正确')
        return
      }
      if (readAs === 'dataurl') {
        readAsDataUrl(fetchFile, i + 1)
      } else if (readAs === 'binarystring') {
        readAsBinaryString(fetchFile, i + 1)
      } else if (readAs === 'text') {
        readAsText(fetchFile, i + 1)
      }
    }
  }
  // base64
  const readAsDataUrl = (file, index) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    readerHandle(reader, index)
  }
  // 二进制
  const readAsBinaryString = (file, index) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    readerHandle(reader, index)
  }
  // 文本
  const readAsText = (file, index) => {
    let reader = new FileReader()
    reader.readAsText(file)
    readerHandle(reader, index)
  }
  // 读取流程
  const readerHandle = (reader, index) => {
    reader.onload = function () {
      if (isZip) {
        let img = new Image()
        img.src = this.result
        img.onload = function () {
          zip(img, index)
        }
      } else if (index === maxLength) {
        callSuccess(this.result)
      }
    }
    reader.onloadstart = function () {
      if (loadStart) loadStart()
    }
    reader.onloadend = function () {
      if (loadEnd) loadEnd()
    }
    reader.onerror = function () {
      callError('文件读取出错')
    }
    reader.onabort = function () {
      callError('文件读取被中断')
    }
    reader.onprogress = function () {
      // console.log('正在读取中')
    }
  }
  // 压缩
  const zip = (img, index) => {
    let width = img.naturalWidth
    let height = img.naturalHeight
    let ratio = null
    let lockWidth = null
    let lockHeight = null
    let canvas = document.createElement('canvas')
    if (zipWidth <= 1) {
      lockWidth = width * zipWidth
      lockHeight = Math.round(height * zipWidth)
    } else {
      lockWidth = zipWidth
      ratio = width / zipWidth
      lockHeight = Math.round(height / ratio)
    }
    canvas.width = lockWidth
    canvas.height = lockHeight
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height, 0, 0, lockWidth, lockHeight)
    let handleImage = canvas.toDataURL(fileType, zipQuality)
    compressed.push(handleImage)
    let sindex = handleImage.indexOf('base64')
    compressedHandle.push(handleImage.substr(sindex + 7))
    if (maxLength === index) {
      callSuccess(compressed, compressedHandle)
    }
  }
  inputEl.addEventListener('change', fileLoad)
}

export default imageReader
