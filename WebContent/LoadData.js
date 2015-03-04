Ext.require([ 'Ext.chart.*' ]);

Ext.define('TestResult', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'ScenarioName',
		type : 'string'
	}, {
		name : 'BuildNum',
		type : 'int'
	}, {
		name : 'BuildUrl',
		type : 'string'
	}, {
		name : 'ServerIP',
		type : 'string'
	}, {
		name : 'Version',
		type : 'string'
	}, {
		name : 'TestCase',
		type : 'string'
	}, {
		name : 'Total',
		type : 'int'
	}, {
		name : 'Passed',
		type : 'int'
	}, {
		name : 'Failed',
		type : 'int'
	}, {
		name : 'Ignored',
		type : 'int'
	}, {
		name : 'Deffered',
		type : 'int'
	}, {
		name : 'PassRate',
		type : 'float'
	} ]
});

var chartDataStore = Ext.create('Ext.data.JsonStore', {
	fields : [ 'ScenarioName', 'Passed', 'Failed', 'Ignored', 'Deffered' ],
	proxy : {
		type : 'ajax',
		url : 'LatestBuildSummaryData.jsp',
		reader : {
			type : 'json',
			root : 'latestBuildData'
		}
	}
});

var gridDataStore = Ext.create('Ext.data.JsonStore', {
	model : 'TestResult',
	proxy : {
		type : 'ajax',
		url : 'LatestBuildData.jsp',
		reader : {
			type : 'json',
			root : 'latestBuildData'
		}
	},
	groupField : 'ScenarioName'
});

Ext.onReady(function() {
	chartDataStore.load({
		callback : function(records, operation, success) {
			if (success) {
				createChart();
			}
			gridDataStore.load({
				callback : function(records, operation, success) {
					if (success) {
						createGrid();
					}
				},
				scope : this
			});
		},
		scope : this
	});
	// gridDataStore.load({
	// callback : function(records, operation, success) {
	// if (success) {
	// createGrid();
	// }
	// },
	// scope : this
	// });
});

function createGrid() {
	var grid = Ext
			.create(
					'Ext.grid.Panel',
					{
						frame : false,
						width : 900,
						// title : 'test',
						renderTo : 'gridContainer',
						store : gridDataStore,
						features : [
								{
									id : 'group',
									ftype : 'groupingsummary',
									enableGroupingMenu : false,
									groupHeaderTpl : Ext
											.create(
													'Ext.XTemplate',
													'Scenario: {name}',
													'  |  Iteration: {children:this.getIteration}',
													'  |  Server IP: {children:this.getIp}',
													'  |  Windchill Version: {children:this.getVersion}',
													{
														getIteration : function(
																children) {
															return Ext.String
																	.format(
																			'<a href="{0}"># {1}</a>',
																			children[0]
																					.get('BuildUrl'),
																			children[0]
																					.get('BuildNum'));
														},
														getIp : function(
																children) {
															return children[0]
																	.get('ServerIP');
														},
														getVersion : function(
																children) {
															return children[0]
																	.get('Version');
														}
													})
								}, {
									ftype : 'summary',
									dock : 'bottom'
								} ],
						columns : [
								{
									text : 'Test Case',
									flex : 1,
									dataIndex : 'TestCase',
									summaryType : 'count',
									summaryRenderer : function(value,
											summaryData, dataIndex) {
										return ((value === 0 || value > 1) ? '('
												+ value + ' Test Cases)'
												: '(1 Test Case)');
									}
								},
								{
									header : 'Total',
									dataIndex : 'Total',
									summaryType : 'sum',
								},
								{
									header : 'Passed',
									dataIndex : 'Passed',
									summaryType : 'sum',
									renderer : function(val) {
										return '<span style="color:green;">'
												+ val + '</span>';
									}
								},
								{
									header : 'Failed',
									dataIndex : 'Failed',
									summaryType : 'sum',
									renderer : function(val) {
										return '<span style="color:red;">'
												+ val + '</span>';
									}
								},
								{
									header : 'Ignored',
									dataIndex : 'Ignored',
									summaryType : 'sum',
									renderer : function(val) {
										return '<span style="color:gray;">'
												+ val + '</span>';
									}
								},
								{
									header : 'Deferred',
									dataIndex : 'Deffered',
									summaryType : 'sum'
								},
								{
									header : 'Pass %',
									dataIndex : 'PassRate',
									summaryType : 'average',
									renderer : function(value, metaData,
											record, rowIdx, colIdx, store, view) {
										if (value > 0.9) {
											return '<span style="color:green;">'
													+ Ext.util.Format
															.number(
																	value * 100,
																	'0.00')
													+ ' %</span>';
										} else {
											return '<span style="color:red;">'
													+ Ext.util.Format
															.number(
																	value * 100,
																	'0.00')
													+ ' %</span>';
										}
									},
									summaryRenderer : function(value,
											summaryData, dataIndex) {
										if (value > 0.9) {
											return '<span style="color:green;">'
													+ Ext.util.Format
															.number(
																	value * 100,
																	'0.00')
													+ ' %</span>';
										} else {
											return '<span style="color:red;">'
													+ Ext.util.Format
															.number(
																	value * 100,
																	'0.00')
													+ ' %</span>';
										}
									}
								} ]
					});
}

function createChart() {
	var colors = [ 'green', 'red', 'yellow', 'gray' ];

	Ext.chart.theme.Browser = Ext.extend(Ext.chart.theme.Base, {
		constructor : function(config) {
			Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
				colors : colors
			}, config));
		}
	});

	var chart = Ext.create('Ext.chart.Chart', {
		animate : true,
		theme : 'Browser:gradients',
		frame : true,
		legend : {
			position : 'right'
		},
		renderTo : 'chartContainer',
		width : 900,
		height : 400,
		insetPadding : 50,
		store : chartDataStore,
		axes : [ {
			title : 'Status',
			type : 'Numeric',
			position : 'left',
			grid : true,
			fields : [ 'Passed', 'Failed', 'Ignored', 'Deffered' ]
		}, {
			type : 'Category',
			position : 'bottom',
			fields : [ 'ScenarioName' ],
			label : {
				rotate : {
					degrees : 345
				}
			}
		} ],
		series : [ {
			type : 'column',
			axis : 'bottom',
			gutter : 110,
			xField : 'ScenarioName',
			yField : [ 'Passed', 'Failed', 'Ignored', 'Deffered' ],
			stacked : true,
			stackedDisplay : true,
			tips : {
				trackMouse : true,
				renderer : function(storeItem, item) {
					this.setTitle(item.value[1]);
				}
			},
			highlight : true,
			label : {
				display : 'outside',
				stackedDisplay : 'total'
			}
		} ]
	});

	return chart;
}