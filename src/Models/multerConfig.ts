import multer from 'multer'
import path from 'path'
import { createHash } from 'crypto'

export const storage = multer.diskStorage({
	destination: (req, file, callback)=>{
		callback(null, path.resolve('public/temp_uploads'))
	},
	filename: (req, file, callback)=>{
		callback(null, `${createHash('md5').update(new Date().getTime().toString()).digest('hex')}`)
	}
})
