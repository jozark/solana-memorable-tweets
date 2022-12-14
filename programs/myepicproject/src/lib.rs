use anchor_lang::prelude::*;

declare_id!("CpAmzB86fsRWzeAWX4zL7gzi4QvTah5U3FBUN62rt9tE");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.total_tweets = 0;
        Ok(())
    }

    pub fn add_tweet(ctx: Context<AddTweet>, tweet_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        let item = ItemStruct {
            tweet_link: tweet_link.to_string(),
            user_address: *user.to_account_info().key,
            likes: Vec::new()
        };

        base_account.tweet_list.push(item);
        base_account.total_tweets += 1;
        Ok(())
    }

    pub fn like_tweet(ctx: Context<LikeTweet>, tweet_link: String) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        for tweet in &mut base_account.tweet_list {
            if tweet.tweet_link == tweet_link {
                tweet.likes.push(*user.to_account_info().key);
            }
        };
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTweet<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct LikeTweet<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub tweet_link: String,
    pub user_address: Pubkey,
    pub likes: Vec<Pubkey>
}

#[account]
pub struct BaseAccount {
    pub total_tweets: u64,
    pub tweet_list: Vec<ItemStruct>,
}
