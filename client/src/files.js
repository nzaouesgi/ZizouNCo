/* 
    The input element must have the "multiple" attribute set.

    When creating an estate, we must:

    - Get all files from the input element. the "files" property is an array of File objects.
    - Compute digests for each file using "computeDigest"
    - Upload each files to server using "uploadFile"
    - Then create the estate on the contract using the hashes and identifiers.

    When downloading a file from the estate details, we must:

    - Get the file content using "getFile" by passing its identifier.
    - Check the file using "verifyDigest", original hash is available within the contract data.
    - If hash is valid, then use "downloadFile" to make the client download the file.
*/

const uploadHost = 'gofile.io'
const uploadProtocol = 'https'
const hashAlgorithm = 'SHA-256'

const range = i => Array(i).keys()

function readData(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader()

        reader.onerror = function (e) {
            const error = e.target.error
            reader.abort()
            reject(error)
        }

        reader.onload = function (e) {
            const data = e.target.result
            resolve(data)
        }

        reader.readAsArrayBuffer(file)
    })
}

async function getServer() {
    const serverResult = await window.fetch(`${uploadProtocol}://apiv2.${uploadHost}/getServer`)

    if (serverResult.status !== 200)
        throw new Error(`Bad status code when retrieving upload server info (${serverResult.status})`)

    const { data = {} } = await serverResult.json()
    const { server = '' } = data

    if (!server)
        throw new Error(`Could not read upload server info`)

    return server
}

/* 
    Upload one file to server-side.
    Input must be a File object.
    Returns a Promise wrapping the unique string identifier to be used when retrieving the file from the server.
*/
export async function uploadFile(file) {

    const server = await getServer()

    const formData = new FormData()
    formData.append('file', file)

    const uploadResult = await window.fetch(`${uploadProtocol}://${server}.${uploadHost}/uploadFile`, {
        method: 'POST',
        body: formData
    })

    if (uploadResult.status !== 200)
        throw new Error(`Bad status code when uploading file (${uploadResult.status})`)

    const deserialized = await uploadResult.json()
    const { data, status } = deserialized

    if (status !== 'ok' || typeof data !== 'object')
        throw new Error(`Bad response when uploading file: ${JSON.stringify(deserialized)}`)

    return data.code
}

/* 
    Get 32 bytes hash for one file
    Takes a File object as input.
    Return a Promise wrapping an ArrayBuffer representing the file's content digest.
*/
export async function computeDigest(file) {
    const data = file instanceof File ? await readData(file) : file
    const digest = await window.crypto.subtle.digest(hashAlgorithm, data)
    return digest;
}

/*
    Verify an ArrayBuffer representing a file's content with an ArrayBuffer representing its expected digest.
    Return a Promise wrapping true if verification succeeds, false otherwise.
*/
export async function verifyDigest(fileContent, digest) {

    const computed = await computeDigest(fileContent)

    for (const i of range(computed.byteLength))
        if (computed[i] !== digest[i])
            return false

    return true
}

/* 
    Retrieve a file from server.
    Takes the string identifier as a parameter.
    Returns a Promise wrapping an ArrayBuffer representing the file content.
*/
export async function getFile(id) {

    const uploadInfoRes = await window.fetch(`${uploadProtocol}://apiv2.${uploadHost}/getUpload?c=${encodeURIComponent(id)}`)

    if (uploadInfoRes.status !== 200)
        throw new Error(`Bad status code when retrieving upload info (${uploadInfoRes.status})`)

    const { data } = await uploadInfoRes.json()
    const entries = Object.keys(data.files)

    const res = await fetch(data.files[entries[0]].link)

    if (res.status !== 200)
        throw new Error(`Bad status code when downloading file`)

    const content = await res.arrayBuffer()

    return {content, ...data.files[entries[0]], code: data.code}
}

/* 
    Make client download a file from memory (the file must have been retrieved from server already).
    The data parameter is an ArrayBuffer representing the file content.
    The filename parameter is a string representing the name of the file when downloading.
*/
export function downloadFile(data, filename) {

    const url = window.URL.createObjectURL(new Blob([data]))
    const a = document.createElement('a')

    a.style.display = 'none'
    a.href = url
    a.download = filename

    window.document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    a.remove()
}

export default {
    verifyDigest,
    downloadFile,
    computeDigest,
    uploadFile,
    getFile
}