import { Response, Request } from "express";

export function protectedRoute(req:Request, res:Response){
	return res.json({'success':'Teste de rota protegida'})
}

export function imageUpload(req:Request, res:Response){
	const fileinfo = req?.file
	const testmsg = req?.body?.testmsg
	////console.log('message: ',testmsg)
	return res.json(fileinfo)
}
