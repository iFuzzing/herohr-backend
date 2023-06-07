import { Response, Request } from "express";

export default function protectedRoute(req:Request, res:Response){
	return res.json({'success':'Teste de rota protegida'})
}
