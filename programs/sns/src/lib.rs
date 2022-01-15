use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("9hLY9Xj5C4e2szcEZDtn7mXLm7kAXJXBSoUF1FsKLtM6");

#[program]
pub mod send_notification {
    use super::*;
    pub fn send_notification(
        ctx: Context<SendNotification>,
        title: String,
        message: String,
    ) -> ProgramResult {
        let notification: &mut Account<Notification> = &mut ctx.accounts.notification;
        let author: &Signer = &ctx.accounts.author;
        let recipient: &AccountInfo = &ctx.accounts.recipient;

        if title.chars().count() > 50 {
            return Err(ErrorCode::TopicTooLong.into());
        }

        if message.chars().count() > 280 {
            return Err(ErrorCode::ContentTooLong.into());
        }

        notification.author = *author.key;
        notification.recipient = *recipient.key;
        notification.title = title;
        notification.message = message;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendNotification<'info> {
    #[account(init, payer = author, space = Notification::LEN)]
    pub notification: Account<'info, Notification>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub recipient: AccountInfo<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[account]
pub struct Notification {
    pub author: Pubkey,
    pub recipient: Pubkey,
    pub title: String,
    pub message: String,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32 * 2;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string.
const MAX_TITLE_LENGTH: usize = 50 * 4; // 50 chars max.
const MAX_MESSAGE_LENGTH: usize = 280 * 4; // 280 chars max.

impl Notification {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author.
        + STRING_LENGTH_PREFIX + MAX_TITLE_LENGTH // Topic.
        + STRING_LENGTH_PREFIX + MAX_MESSAGE_LENGTH; // Content.
}

#[error]
pub enum ErrorCode {
    #[msg("Title cannot be more than 50 characters.")]
    TopicTooLong,
    #[msg("Mesage cannot be more than 50 characters.")]
    ContentTooLong,
}
