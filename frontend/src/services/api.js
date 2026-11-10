const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const apiUrl = (path) => `${API_BASE_URL}${path}`

export async function generatePresignedUrl(fileName, contentType = 'image/jpeg') {
  try {
    const response = await fetch(apiUrl('/generate-presigned-url'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileName, contentType }) })
    if (!response.ok) throw new Error(`Could not generate an upload URL (HTTP ${response.status}).`)
    return response.json()
  } catch (error) {
    if (error.message.startsWith('Could not generate')) throw error
    throw new Error('Could not reach the upload service. Check the API URL and try again.')
  }
}

export async function uploadImageToS3(uploadUrl, imageBlob) {
  try {
    const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: imageBlob })
    if (!response.ok) throw new Error(`The image upload failed (HTTP ${response.status}).`)
    return response
  } catch (error) {
    if (error.message.startsWith('The image upload failed')) throw error
    throw new Error('The image upload could not reach S3. Check the presigned URL and try again.')
  }
}

// Recognition is asynchronous after S3 upload. Person 2 can provide the endpoint contract here.
export async function getRecognitionResult(_s3Key) {
  throw new Error('Recognition result endpoint is not configured yet.')
}
