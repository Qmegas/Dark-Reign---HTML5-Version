function WeaponHolder(config_name)
{
	var config, position, unit, target = null, last_shoot = 0;
	
	this.init = function(obj)
	{
		unit = obj;
		config = WeaponConfig[config_name];
		this.updatePosition();
	};
	
	this.updatePosition = function()
	{
		if (unit.is_building)
		{
			position = {
				x: parseInt(unit.position.x - unit._proto.images.weapon.padding.x + unit._proto.images.weapon.size.x/2),
				y: parseInt(unit.position.y - unit._proto.images.weapon.padding.y + unit._proto.images.weapon.size.y/2)
			};
		}
		else
		{
			position = {
				x: unit.position.x + 12,
				y: unit.position.y + 12
			};
		}
	};
	
	this.canAttackTarget = function(target)
	{
		if (target.type == 'object')
		{
			if (unit.uid == target.objid)
				return false;
			
			if (game.objects[target.objid]._proto.move_mode == MOVE_MODE_FLY)
				return config.can_shoot_flyer;
			else
				return config.can_shoot_ground;
		}
		
		if (target.type == 'ground')
			return config.can_shoot_ground;
		
		return false;
	};
	
	this.setTarget = function(trg)
	{
		target = trg;
	};
	
	//Can shoot now?
	this.canShoot = function()
	{
		return ((last_shoot + config.firedelay) < (new Date()).getTime());
	};
	
	this.isTargetAlive = function()
	{
		if (target.type == 'object')
			if (game.objects[target.objid] === undefined)
			{
				if (unit.is_building)
					unit.state = 'NORMAL';
				else
					unit.state = 'STAND';
				target = null;
				return false;
			}
		return true;
	};
	
	this.getTargetPosition = function()
	{
		var pos = target, obj;
		
		if (target.type == 'object')
		{
			obj = game.objects[target.objid];
			pos = {x: obj.position.x, y: obj.position.y};
			if (obj.is_building)
			{
				pos.x += obj._proto.cell_padding.x * CELL_SIZE;
				pos.y += obj._proto.cell_padding.y * CELL_SIZE;
			}
		}
		
		return {
			x: pos.x + 12,
			y: pos.y + 12
		};
	};
	
	this._getDistance = function()
	{
		var target_pos = this.getTargetPosition();
		return Math.sqrt(Math.pow((position.x - target_pos.x)/CELL_SIZE, 2) + Math.pow((position.y - target_pos.y)/CELL_SIZE, 2));
	};
	
	this.canReach = function()
	{
		var distance = this._getDistance();
		return ((distance >= config.minimum_range) && (distance <= config.maximum_range));
	};
	
	this.shoot = function()
	{
		var to = this.getTargetPosition();
		
		last_shoot = (new Date()).getTime();
		
		//Rotate unit
		if (unit.is_building)
			unit.setWeaponDirection(8 - parseInt(Math.atan2(position.y - to.y, position.x - to.x)*(180/Math.PI)/23.5));
		else
			unit.move_direction = 4 - parseInt(Math.atan2(position.y - to.y, position.x - to.x)*(180/Math.PI)/45);
		
		//Create bulet
		var uid = game.objects.length, bulet = new Bulet(config_name);
		bulet.uid = uid;
		game.objects.push(bulet);
		bulet.init(position, to);
	};
	
	this.canAttackGround = function()
	{
		return config.can_shoot_ground;
	};
	
	this.canAttackFly = function()
	{
		return config.can_shoot_flyer;
	};
}

WeaponHolder.loadResources = function()
{
	for (var i in WeaponConfig)
	{
		if (WeaponConfig[i].fire_sound)
			game.resources.addSound(WeaponConfig[i].fire_sound, 'sounds/weapon/' + WeaponConfig[i].fire_sound + '.' + AUDIO_TYPE);
	}
};