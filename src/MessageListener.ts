import fastify, { FastifyInstance } from 'fastify';
import * as vscode from 'vscode';
import { MESSAGE_ENDPOINT, OUTPUT_CHANNEL_NAME } from './constants';
import { WoaruMessageSchema, WoaruMessage } from './types';
import { CursorService } from './CursorService';
import { Formatter } from './Formatter';

/**
 * MessageListener class - handles HTTP server for receiving WOARU messages
 */
export class MessageListener {
  private server: FastifyInstance | null = null;
  private outputChannel: vscode.OutputChannel;
  private port: number;
  private cursorService: CursorService;

  constructor(port: number) {
    this.port = port;
    this.outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    this.cursorService = new CursorService();
  }

  /**
   * Start the HTTP server
   */
  public async start(): Promise<void> {
    try {
      this.server = fastify({ logger: false });
      
      // Register POST endpoint for receiving messages
      this.server.post(MESSAGE_ENDPOINT, async (request, reply) => {
        try {
          this.log('INFO', `Received request: ${JSON.stringify(request.body)}`);
          
          // Validate request body with Zod
          const validatedPayload: WoaruMessage = WoaruMessageSchema.parse(request.body);
          
          this.log('INFO', `Valid payload received: ${JSON.stringify(validatedPayload)}`);
          
          // Format message and send to cursor
          const formattedMessage = Formatter.formatMessage(validatedPayload);
          await this.cursorService.displayMessage(formattedMessage);
          
          await reply.status(200).send({ status: 'success' });
        } catch (error) {
          this.log('ERROR', `Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}`);
          await reply.status(400).send({ status: 'error', message: 'Invalid payload' });
        }
      });

      // Bind server to localhost only for security
      await this.server.listen({ port: this.port, host: '127.0.0.1' });
      this.log('INFO', `WOARU Letterboy server started on port ${this.port}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log('ERROR', `Failed to start server: ${errorMessage}`);
      
      // Error handling is done in extension.ts
      
      throw error;
    }
  }

  /**
   * Stop the HTTP server
   */
  public async stop(): Promise<void> {
    if (this.server) {
      try {
        await this.server.close();
        this.log('INFO', 'WOARU Letterboy server stopped');
      } catch (error) {
        this.log('ERROR', `Failed to stop server: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        this.server = null;
      }
    }
  }

  /**
   * Log message with timestamp and level
   */
  private log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    const timestamp = new Date().toISOString();
    this.outputChannel.appendLine(`${timestamp} [${level}] ${message}`);
  }
}