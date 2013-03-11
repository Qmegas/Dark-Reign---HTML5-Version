function TaelonPowerBuilding(pos_x, pos_y, player)
{
	this._proto = TaelonPowerBuilding;
	this.player = player;
	this.health = this._proto.health_max;
	
	this.res_now = 0;
	this.res_max = 1000;
	
	this.init(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'SELL':
				this._runStandartSell();
				break;
		}
	};
	
	this.onConstructed = function() 
	{
		var cell = this.getCell();
		
		this.res_now = 500;
		game.players[this.player].energyAddMax(this.res_now);
		
		AbstractUnit
			.createNew(FreighterUnit, cell.x + 1, cell.y + 2, this.player, true)
			.orderHarvest(this);
	};
	
	this.onDestructed = function()
	{
		game.players[this.player].energyAddMax(-1*this.res_now);
	};
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + CELL_SIZE*this._proto.cell_size.x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 57 - game.viewport_y, 
			taelon_h = parseInt((this.res_now/this.res_max)*58);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 60);
		
		if (this.res_max > this.res_now)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 58);
		}
		
		game.viewport_ctx.fillStyle = '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 59 - taelon_h, 2, taelon_h);
	};
	
	this.isHarvestPlatform = function()
	{
		return true;
	};
	
	this.increaseRes = function(amount)
	{
		var incr = this._standardIncreaseRes(amount);
		game.players[this.player].energyAddMax(incr);
		return incr;
	};
}

AbstractBuilding.setBuildingCommonOptions(TaelonPowerBuilding);

TaelonPowerBuilding.res_key = 'taelon_power';
TaelonPowerBuilding.obj_name = 'Taelon Power Generator';
TaelonPowerBuilding.cost = 2000;
TaelonPowerBuilding.sell_cost = 1000;
TaelonPowerBuilding.health_max = 1450;
TaelonPowerBuilding.build_time = 20;
TaelonPowerBuilding.enabled = true;
TaelonPowerBuilding.can_build = true;
TaelonPowerBuilding.crater = 1;

TaelonPowerBuilding.cell_size = {x: 4, y: 4};
TaelonPowerBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1];
TaelonPowerBuilding.move_matrix = [0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0];
TaelonPowerBuilding.cell_padding = {x: 2, y: 1};
TaelonPowerBuilding.image_size = {x: 90, y: 123};
TaelonPowerBuilding.image_padding = {x: -4, y: 33};
TaelonPowerBuilding.image_animated = true;
TaelonPowerBuilding.image_animation_frames = [1,2,3,2];
TaelonPowerBuilding.shadow_image_size = {x: 69, y: 62};
TaelonPowerBuilding.shadow_image_padding = {x: -49, y: 2};