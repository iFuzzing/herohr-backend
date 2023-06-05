import { NextFunction, Request, Response } from "express"

function handleRequestLogs(req:Request, res:Response, next:NextFunction){
	const requestItem = `${req.ip} - - ${new Date().toString()} - - ${req.method} - - ${req.url} - - ${req.headers["user-agent"]}`
	console.log(requestItem)
	next()
}

export default handleRequestLogs
