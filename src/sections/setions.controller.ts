import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/classroom/:url/channels')
export class ChannelsController {
        @Get()
        getAllChannels(){

        }

        @Post()
        createChannels(){


        }
        
        @Get(':name')
        getSpecificChannels(){


        }

        @Get(':name/chats')
        getChat(@Query() query, @Param() param){
            console.log(query.perPage, query.page);
            console.log(param.id, param.url);
        }
    
        @Post(':name/chats')
        postChat(@Body() body){
    
    
        }

        @Get(':name/members')
        getAllMembers(){


        }

        @Get(':name/members')
        getInviteMembers(){

            
        }

}
