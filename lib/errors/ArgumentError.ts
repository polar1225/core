import ErrorBase				from "awayjs-core/lib/errors/ErrorBase";

/**
 * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
 * by a concrete subclass.
 */
class ArgumentError extends ErrorBase
{
	/**
	 * Create a new ArgumentError.
	 *
	 * @param message An optional message to override the default error message.
	 * @param id The id of the error.
	 */
	constructor(message:string = null, id:number = 0)
	{
		super(message || "ArgumentError", id);
	}
}

export default ArgumentError;