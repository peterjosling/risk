package uk.ac.standrews.cs.cs3099.risk.game;

import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

/**
 * Logger Class
 * Adds useful information to standard output
 */
public class Logger {

	private static DateFormat df;

	/**
	 * Static initialiser
	 * Just sets up the DateFormat object
	 */
	static {
		df = new SimpleDateFormat("HH:mm:ss");
	}

	/**
	 * Print method
	 * Prints a normal string to standard output
	 */
	public static void print(String s)
	{
		System.out.println(String.format("%s - %s", df.format(new Date()), s));
	}

	/**
	 * Formatted print
	 * Another wrapper around System.out.printf
	 */
	public static void printf(String fmt, Object... args)
	{
		System.out.println(String.format("[%s] -- %s", df.format(new Date()), String.format(fmt, args)));
	}

}
