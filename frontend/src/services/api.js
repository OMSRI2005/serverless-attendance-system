const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const PRESIGNED_URL_PATH = '/generate-presigned-url'
const ATTENDANCE_PATH = '/attendance'

export const CAPTURE_PREFIX = 'incoming-captures/'
export const isApiConfigured = Boolean(API_BASE_URL)

function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

async function readJson(response) {
  const text = await response.text()
  if (!text) return {}
  try { return JSON.parse(text) } catch { return { message: text } }
}

async function request(path, options) {
  try {
    const response = await fetch(apiUrl(path), options)
    const data = await readJson(response)
    if (!response.ok) throw new Error(data.message || `Backend request failed (HTTP ${response.status}).`)
    return data
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Could not reach the backend API. Check the API URL and CORS settings.')
    throw error
  }
}

export async function detectImageMimeType(blob) {
  const bytes = new Uint8Array(await blob.slice(0, 8).arrayBuffer())
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const isPng = bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  if (isJpeg) return 'image/jpeg'
  if (isPng) return 'image/png'
  throw new Error('The captured image is not a supported JPEG or PNG.')
}

export async function generatePresignedUrl(contentType) {
  if (!['image/jpeg', 'image/png'].includes(contentType)) throw new Error('Only JPEG and PNG images can be uploaded.')
  const data = await request(PRESIGNED_URL_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType }),
  })
  if (!data || typeof data.uploadUrl !== 'string' || typeof data.s3Key !== 'string' || typeof data.contentType !== 'string') throw new Error('The upload service returned an invalid response.')
  if (!data.s3Key.startsWith(CAPTURE_PREFIX)) throw new Error('The upload service returned an unexpected storage path.')
  if (data.contentType !== contentType) throw new Error('The upload service returned a mismatched image type.')
  return data
}

export async function uploadImageToS3(uploadUrl, imageBlob, contentType) {
  if (!uploadUrl || !contentType) throw new Error('The upload service returned incomplete upload details.')
  try {
    const response = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: imageBlob })
    if (!response.ok) {
      if (response.status === 400 || response.status === 403) throw new Error('The secure upload URL may have expired. Please capture a new image and try again.')
      throw new Error(`The image upload failed (HTTP ${response.status}).`)
    }
    return response
  } catch (error) {
    if (error.message.includes('secure upload URL') || error.message.startsWith('The image upload failed')) throw error
    throw new Error('The image upload could not reach S3. Check the presigned URL and S3 CORS settings.')
  }
}

export async function getAttendanceRecords(filters = {}) {
  const { employeeId = '', date = '', status = '' } = filters
  if (employeeId && !date) throw new Error('The confirmed API contract requires a date with an employee ID filter.')
  if (employeeId && status) throw new Error('The confirmed API contract does not support combining employee ID and status filters.')
  const params = new URLSearchParams()
  if (employeeId) params.set('employee_id', employeeId)
  if (status) params.set('status', status)
  if (date) params.set('date', date)
  const data = await request(`${ATTENDANCE_PATH}${params.toString() ? `?${params}` : ''}`, { method: 'GET' })
  const records = Array.isArray(data) ? data : data?.records
  if (!Array.isArray(records)) throw new Error('The attendance service returned an invalid records response.')
  return records
}

// Recognition remains intentionally unimplemented until Sushant provides its endpoint contract.
export function requestRecognition() {
  return Promise.resolve({ configured: false, attendanceMarked: false })
}
