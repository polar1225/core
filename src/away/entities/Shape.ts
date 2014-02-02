///<reference path="../_definitions.ts"/>

/**
 * This class is used to create lightweight shapes using the ActionScript
 * drawing application program interface(API). The Shape class includes a
 * <code>graphics</code> property, which lets you access methods from the
 * Graphics class.
 *
 * <p>The Sprite class also includes a <code>graphics</code>property, and it
 * includes other features not available to the Shape class. For example, a
 * Sprite object is a display object container, whereas a Shape object is not
 * (and cannot contain child display objects). For this reason, Shape objects
 * consume less memory than Sprite objects that contain the same graphics.
 * However, a Sprite object supports user input events, while a Shape object
 * does not.</p>
 */
module away.entities
{
	export class Shape extends away.base.DisplayObject
	{
		private _graphics:away.base.Graphics;

		/**
		 * Specifies the Graphics object belonging to this Shape object, where vector
		 * drawing commands can occur.
		 */
		get graphics():away.base.Graphics
		{
			return this._graphics;
		}

		/**
		 * Creates a new Shape object.
		 */
		constructor()
		{
			super();
		}
	}
}

