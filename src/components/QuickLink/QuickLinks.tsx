import { useMutation, useQuery } from '@apollo/client';
import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc';
import { updateQuickLinkMutation } from '../../graphql/mutation/quick-link';
import { getQuickLinksByRegionQuery } from '../../graphql/queries/quick-link';
import { UserContext } from '../../providers/UserContext/UserProvider';
import { QuickLinkCard } from './QuickLinkCard';
import { QuickLink, QUICKLINK_TYPE } from './QuickLinkCardProps';
import QuickLinkEdit from './QuickLinkEdit';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import QuickLinkReservedEdit from './QuickLinkReservedEdit';
import CustomConfirmModal from '../CustomConfirmModal/CustomConfirmModal';
import { useHistory } from 'react-router-dom';
import Withdrawal from '../../screens/Admin/SiteManagement/Withdrawal/Withdrawal';

export const QuickLinks: React.FC<any> = ({backAction}) => {
	const { me, setMe } = useContext(UserContext)

	//	Quick Links state which saves Quick Links array
	const [quickLinks, setQuickLinks] = useState([]);
	//	Selected Quick Link state
	const [selectedQuickLink, selectQuickLink] = useState(null);

	//	region State
	const [region, setRegion] = useState(0);

	//	Flag state which shows if the form has changed or not
	const [hasChange, setChanged] = useState(false);

	//	Flag state which indicate to show the leaving confirmation modal
	const [leavingConfirmModal, showLeavingConfirmModal] = useState(false)

	//	Detect profile change
	useEffect(() => {
		if(me) {
			resetRegion();
		}
	}, [me]);

	const isEditable = () => {
		return me.level <= 2;
	}

	const resetRegion = () => {
		let nextRegion = 0;
		if(isEditable())
			nextRegion = me.selectedRegionId;
		else if(me.userRegion.length > 0) {
			nextRegion = me.userRegion[0].region_id;
		}
		else {
			nextRegion = 0;
			console.error('Can not get user region.', me);
		}

		if(nextRegion != 0) {
			if(page != '' && hasChange) {
				showLeavingConfirmModal(true);
			}
			else {
				setRegion(nextRegion);
			}
		}
	}

	//	Detect Region change
	useEffect(() => {
		if(region != 0 && page != '') {
			setPage('');
		}
	}, [region]);

	const history = useHistory();
	useEffect(() => {
		window.onbeforeunload = (e) => {
			if(!hasChange)	return;
			e?.preventDefault();
			return 'Unsaved changes';
		};
		const unreg = history.block(() => {
			if(hasChange) {
				return JSON.stringify({
          header: 'Unsaved Changes',
          content: 'Are you sure you want to leave without saving changes?'
				})
			}
		});
		return () => {
			unreg();
			window.onbeforeunload = null;
		};
	}, [history, hasChange]);

	//	A State which indicates which page is showing now.	'' => List Page, 'edit' => Edit Page, 'reserved' => Reserved information edit page(Website Link Edit Page)
	const [page, setPage] = useState('');
	useEffect(() => {
		if(page == '') {
			selectQuickLink(null);
			setChanged(false);
			resetRegion();
		}
	}, [page]);
	useEffect(() => {
		if(selectedQuickLink && page == '')
			setPage('edit')
	}, [selectedQuickLink]);

	//	Flag State which indicates to show delete confirmation modal
	const [warningModalOpen, setWarningModalOpen] = useState(null);

	//	Read Quick Links from the database
	const { data: quickLinksData } = useQuery(getQuickLinksByRegionQuery, {
		variables: {
			regionId: region
		},
		fetchPolicy: 'network-only',
	})
	useEffect(() => {
		if(quickLinksData != undefined) {
			const { getQuickLinksByRegion } = quickLinksData;

			arrangeQuickLinks(
				!isEditable() ? getQuickLinksByRegion :
					getQuickLinksByRegion.concat([{
						id: 0,
						title: 'Add New',
						subtitle: 'Subtitle',
						region_id: region,
						sequence: getQuickLinksByRegion.length,
						reserved: '',
						flag: 0
					}])
			);
		}
	}, [quickLinksData]);

	//	Update Quick Link mutation into the Database
	const [updateQuickLink, {data: updateQuickLinkData}] = useMutation(updateQuickLinkMutation);
	
	//	Update Quick Links array by replacing or inserting a quickLink
	const updateQuickLinks = (quickLink: QuickLink) => {
		if(page == 'edit')
			selectQuickLink(quickLink);

		//	Check if exists
		let i;
		for(i = 0; i < quickLinks.length; i++) {
			if(quickLinks[i].id == quickLink.id)
				break;
		}

		if(i == quickLinks.length) {
			//	Add
			let newQuickLinks = JSON.parse(JSON.stringify(quickLinks));
			newQuickLinks.splice(newQuickLinks.length - 1, 0, quickLink);
			arrangeQuickLinks(newQuickLinks);
		}
		else {
			//	Update
			let newQuickLinks = JSON.parse(JSON.stringify(quickLinks));
			for(i = 0; i < newQuickLinks.length; i++) {
				if(newQuickLinks[i].id == quickLink.id) {
					if(newQuickLinks[i].flag != quickLink.flag) {
						updateQuickLink({
							variables: {
								quickLinkInput: {
										quickLink: {
												id: quickLink.id,
												flag: quickLink.flag
										}
								}
							}
						});
					}

					Object.assign(newQuickLinks[i], quickLink);
					if(quickLink.flag == 2) {
						newQuickLinks.splice(i, 1);
					}
					break;
				}
			}
			arrangeQuickLinks(newQuickLinks);
		}

		setChanged(false);
	}
	const SortableQuickLinkCard = SortableElement(({item, action, onAction}) => (
		<li style={{listStyleType: 'none', display: 'inline-block', width: '33%'}}><QuickLinkCard item={item} action={action} onAction={onAction} /></li>
	));

	const SortableQuickLinkListContainer = SortableContainer(({ items }: { items: QuickLink[] }) => (
		<ul style={{textAlign: 'left'}}>
			{items.map((item, idx) => (
				<SortableQuickLinkCard index={idx} key={idx}
					item={item}
					action={!isEditable() || item.id == 0 ? false : true}
					onAction={(evt_type) => {
						switch(evt_type) {
							case "click":
								if(!isEditable()) {
									switch(item.type) {
										case QUICKLINK_TYPE.WEBSITE_LINK:
											window.open(item.reserved, '_blank');
										default:
											console.error('Not implemented yet.', item);
											break;
									}
								}
								break;
							case "edit":
								selectQuickLink(item);
								break;
							case "add":
								selectQuickLink(item);
								break;
							case "archive":
								updateQuickLinks({
									...item,
									flag: 1
								});
								break;
							case "restore":
								updateQuickLinks({
									...item,
									flag: 0
								});
								break;
							case "delete":
								setWarningModalOpen(item);
								break;
							default:
								break;
						}
					}}
				/>
			))}
		</ul>
	))

	const arrangeQuickLinks = (oldQuickLinks: QuickLink[]) => {
		if(oldQuickLinks == null)
			oldQuickLinks = quickLinks;

		let i, newQuickLinks = [];
		for(i = 0; i < oldQuickLinks.length; i++) {
			if(oldQuickLinks[i].flag == 0 && oldQuickLinks[i].id != 0)
				newQuickLinks.push({
					...oldQuickLinks[i]
				});
		}
		for(i = 0; i < oldQuickLinks.length; i++) {
			if(oldQuickLinks[i].id == 0)
				newQuickLinks.push({
					...oldQuickLinks[i]
				});
		}
		for(i = 0; i < oldQuickLinks.length; i++) {
			if(oldQuickLinks[i].flag == 1 && oldQuickLinks[i].id != 0)
				newQuickLinks.push({
					...oldQuickLinks[i]
				});
		}

		for(i = 0; i < newQuickLinks.length; i++) {
			if(i != newQuickLinks[i].sequence) {
				newQuickLinks[i].sequence = i;
				if(newQuickLinks[i].id != 0) {
					updateQuickLink({
						variables: {
							quickLinkInput: {
									quickLink: {
											id: newQuickLinks[i].id,
											sequence: newQuickLinks[i].sequence
									}
							}
						}
					});
				}
			}
		}
		setQuickLinks(newQuickLinks);
	}

	const BackHeader = () => (
    <Grid
      container
      sx={{
        p: 2,
        width: 'auto',
        margin: 'auto',
        background:'inherit',
      }}
    >
      <ButtonBase onClick={backAction} sx={{ p: 1 }} disableRipple>
        <Grid container justifyContent='flex-start' alignItems='center'>
          <ArrowBackIosOutlinedIcon />
          <Typography sx={{ fontWeight: 700, fontSize: 20, ml: 1 }}>Quick Links</Typography>
        </Grid>
      </ButtonBase>
    </Grid>
  )

	return (
		<Box>
			{
				selectedQuickLink == null && isEditable() &&
				<BackHeader />
			}
			{
				selectedQuickLink == null &&
					<SortableQuickLinkListContainer
						axis="xy"
						items={quickLinks}
						useDragHandle={true}
						onSortEnd={({ oldIndex, newIndex }) => {
							const newQuickLinks = arrayMove(quickLinks, oldIndex, newIndex).map((v, i) => ({
								...v
							}));
							arrangeQuickLinks(newQuickLinks);
						}}
					/>
			}
			{
				selectedQuickLink && page == 'edit' && selectedQuickLink.type != QUICKLINK_TYPE.WITHDRAWAL &&
					<QuickLinkEdit
						quickLink={selectedQuickLink}
						updateQuickLinks={updateQuickLinks}
						action={setPage}
						handleChange={setChanged}
					/>
			}
			{
				selectedQuickLink && page == 'edit' && selectedQuickLink.type == QUICKLINK_TYPE.WITHDRAWAL &&
					<Withdrawal
						quickLink={selectedQuickLink}
						updateQuickLinks={updateQuickLinks}
						action={setPage}
						handleChange={setChanged}
						region={region}
					/>
			}
			{
				selectedQuickLink && page == 'reserved' &&
					<QuickLinkReservedEdit
						quickLink={selectedQuickLink}
						updateQuickLinks={updateQuickLinks}
						action={setPage}
						handleChange={setChanged}
					/>
			}
			{
				warningModalOpen != null &&
					<CustomConfirmModal
						header="Delete Quick Link" 
						content="Are you sure you want to delete this quick link?"
						handleConfirmModalChange={(val: boolean, isOk: boolean) => {
							if(isOk) {
								updateQuickLinks({
									...warningModalOpen,
									flag: 2
								});
							}
							else {
								//setMe({
								//	...me,
								//	selectedRegionId: selectedQuickLink.region_id
								//});
							}
							setWarningModalOpen(null);
						}}
					/>
			}
			{
				leavingConfirmModal &&
					<CustomConfirmModal
						header="Unsaved Changes" 
						content="Are you sure you want to leave without saving changes?"
						handleConfirmModalChange={(val: boolean, isOk: boolean) => {
							showLeavingConfirmModal(false);
							if(isOk) {
								setPage('');
							}
							else {
								//setMe({
								//	...me,
								//	selectedRegionId: selectedQuickLink.region_id
								//});
							}
						}}
					/>
			}
		</Box>
	);
}
